import { act, renderHook } from '@testing-library/react';
import { addSelectedFiles, readAttachmentFile } from 'src/features/ManageClaimAttachments';
import { useClaimFormState } from './useClaimFormState';

jest.mock('src/features/ManageClaimAttachments', () => ({
  ...jest.requireActual('src/features/ManageClaimAttachments'),
  addSelectedFiles: jest.fn(
    jest.requireActual('src/features/ManageClaimAttachments').addSelectedFiles,
  ),
  readAttachmentFile: jest.fn(),
}));

const read = jest.mocked(readAttachmentFile);
const photo = (name: string, size = 1) => {
  const file = new File(['x'], name, { type: 'image/jpeg', lastModified: 123 });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};
const imageType = { order: 1, type: 1, name: 'Фото', minAmount: 0, mediaType: 'image' as const };

beforeEach(() => {
  jest.clearAllMocks();
  read.mockImplementation(() => new Promise(() => {}));
  jest.spyOn(window, 'scrollTo').mockImplementation();
});
afterEach(() => jest.restoreAllMocks());

test('validates once and groups every rejection reason without size advice', () => {
  const { result } = renderHook(useClaimFormState);
  const files = [
    photo('same.jpg', __MAX_ATTACHMENTS_SIZE_BYTES__),
    photo('same.jpg', __MAX_ATTACHMENTS_SIZE_BYTES__),
    new File(['x'], 'video.mp4', { type: 'video/mp4' }),
    photo('extra.jpg'),
    photo('another.jpg'),
  ];
  act(() => result.current.addFiles(files, imageType));
  expect(addSelectedFiles).toHaveBeenCalledTimes(1);
  expect(addSelectedFiles).toHaveBeenCalledWith(expect.objectContaining({ files }));
  expect(result.current.formState.attachments).toHaveLength(1);
  expect(read.mock.calls.map(([, signal]) => signal.aborted)).toEqual([
    false,
    true,
    true,
    true,
    true,
  ]);
  expect(result.current.pageError).toMatchObject({
    origin: 'attachmentSelection',
    message: expect.stringContaining('Некоторые файлы не прикреплены.'),
  });
  const notice = result.current.pageError;
  if (typeof notice === 'string') throw new Error('Expected selection notice');
  for (const name of ['same.jpg', 'video.mp4', 'extra.jpg', 'another.jpg']) {
    expect(notice.message).toContain(name);
  }
  expect(notice.message.match(/общий лимит/g)).toHaveLength(1);
  expect(notice.message).not.toContain('удалите часть');
});

test('matches reads by index when names repeat and keeps a later smaller file', async () => {
  const { result } = renderHook(useClaimFormState);
  const files = [photo('same.jpg', __MAX_ATTACHMENTS_SIZE_BYTES__ + 1), photo('same.jpg')];
  read.mockImplementation((file) => Promise.resolve(file));
  await act(async () => result.current.addFiles(files, imageType));
  expect(result.current.formState.attachments).toHaveLength(1);
  expect(result.current.formState.attachments[0].file).toBe(files[1]);
  expect(result.current.formState.attachments[0].status).toBe('selected');
  expect(read.mock.calls.map(([, signal]) => signal.aborted)).toEqual([true, false]);
});

test('clears only selection notices on success and leaves cancellation unchanged', () => {
  const { result } = renderHook(useClaimFormState);
  act(() => result.current.addFiles([photo('large.jpg', __MAX_ATTACHMENTS_SIZE_BYTES__ + 1)]));
  const previous = result.current.pageError;
  act(() => result.current.addFiles([]));
  expect(result.current.pageError).toBe(previous);
  act(() => result.current.addFiles([photo('good.jpg')]));
  expect(result.current.pageError).toBe('');
  act(() => result.current.setPageError({ source: 'api', message: 'Сервис недоступен' }));
  act(() => result.current.addFiles([photo('next.jpg')]));
  expect(result.current.pageError).toEqual({ source: 'api', message: 'Сервис недоступен' });
});

test('can select the same file after removing it', async () => {
  read.mockImplementation((file) => Promise.resolve(file));
  const { result } = renderHook(useClaimFormState);
  const file = photo('photo.jpg');
  await act(async () => result.current.addFiles([file]));
  act(() => result.current.removeFile(result.current.formState.attachments[0].localId));
  await act(async () => result.current.addFiles([file]));
  expect(result.current.formState.attachments).toHaveLength(1);
  expect(result.current.formState.attachments[0].status).toBe('selected');
  expect(result.current.pageError).toBe('');
});
