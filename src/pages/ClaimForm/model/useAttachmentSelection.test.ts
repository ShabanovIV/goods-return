import { act, renderHook } from '@testing-library/react';
import { readAttachmentFile } from 'src/features/ManageClaimAttachments';
import { useClaimFormState } from './useClaimFormState';

jest.mock('src/features/ManageClaimAttachments/lib/readAttachmentFile', () => ({
  readAttachmentFile: jest.fn(),
}));

const read = jest.mocked(readAttachmentFile);
const photo = () => new File(['photo'], 'photo.jpg', { type: 'image/jpeg', lastModified: 123 });
const imageType = { order: 1, type: 1, name: 'Фото', minAmount: 0, mediaType: 'image' as const };

beforeEach(() => {
  read.mockReset().mockImplementation(() => new Promise(() => {}));
  jest.spyOn(window, 'scrollTo').mockImplementation();
});
afterEach(() => jest.restoreAllMocks());

test('starts reading before metadata and reserves the global limit across selections', () => {
  const { result, unmount } = renderHook(useClaimFormState);
  const file = photo();
  Object.defineProperty(file, 'size', {
    get: () => {
      expect(read).toHaveBeenCalledWith(file, expect.any(AbortSignal));
      return __MAX_ATTACHMENTS_SIZE_BYTES__;
    },
  });
  act(() => {
    result.current.addFiles([file], imageType);
    result.current.addFiles([new File(['x'], 'other.jpg')], { ...imageType, order: 2 });
  });
  expect(result.current.formState.attachments).toHaveLength(1);
  expect(result.current.formState.attachments[0]).toMatchObject({
    status: 'processing',
    file: undefined,
  });
  expect(result.current.pageError).toContain('Общий размер');
  expect(read.mock.calls[1][1].aborted).toBe(true);
  expect(read.mock.calls[0][1].aborted).toBe(false);
  unmount();
  expect(read.mock.calls[0][1].aborted).toBe(true);
});

test('cancels duplicate and wrong-type files without adding them', () => {
  const { result } = renderHook(useClaimFormState);
  act(() => {
    result.current.addFiles([photo()], imageType);
    result.current.addFiles([photo()], { ...imageType, order: 2 });
    result.current.addFiles([new File(['video'], 'video.mp4', { type: 'video/mp4' })], imageType);
  });
  expect(result.current.formState.attachments).toHaveLength(1);
  expect(read.mock.calls.map(([, signal]) => signal.aborted)).toEqual([false, true, true]);
});

test('starts the whole batch before reading metadata of its first file', () => {
  const files = [photo(), new File(['two'], 'two.jpg'), new File(['three'], 'three.jpg')];
  Object.defineProperty(files[0], 'name', {
    get: () => {
      expect(read.mock.calls.map(([file]) => file)).toEqual(files);
      return 'photo.jpg';
    },
  });
  const { result } = renderHook(useClaimFormState);
  act(() => result.current.addFiles(files, imageType));
  expect(result.current.formState.attachments).toHaveLength(3);
  expect(read.mock.calls.every(([, signal]) => !signal.aborted)).toBe(true);
});

test.each(['remove', 'reset'] as const)(
  'cancels on %s and ignores late read results',
  async (action) => {
    const deferred: { finish?: (file: File) => void } = {};
    read.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          deferred.finish = resolve;
        }),
    );
    const { result } = renderHook(useClaimFormState);
    act(() => result.current.addFiles([photo()]));
    act(() => {
      if (action === 'reset') result.current.resetForm();
      else result.current.removeFile(result.current.formState.attachments[0].localId);
    });
    expect(read.mock.calls[0][1].aborted).toBe(true);
    await act(async () => deferred.finish!(photo()));
    expect(result.current.formState.attachments).toEqual([]);
  },
);

test('marks read errors and keeps successful copies from the same selection', async () => {
  const copy = photo();
  read.mockRejectedValueOnce(new DOMException('Unreadable', 'NotReadableError'));
  read.mockResolvedValueOnce(copy);
  const { result } = renderHook(useClaimFormState);
  await act(async () => result.current.addFiles([new File(['bad'], 'bad.jpg'), photo()]));
  expect(result.current.formState.attachments[0]).toMatchObject({
    status: 'error',
    file: undefined,
    errorReason: 'read',
    errorDetails: 'NotReadableError: Unreadable',
  });
  expect(result.current.formState.attachments[1]).toMatchObject({ status: 'selected' });
  expect(result.current.formState.attachments[1].file).toBe(copy);
});
