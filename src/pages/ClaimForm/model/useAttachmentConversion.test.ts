import { act, renderHook, waitFor } from '@testing-library/react';
import { convertHeic } from 'src/features/ManageClaimAttachments';
import {
  toPersistedClaimDraft,
  fromPersistedClaimDraft,
  isPersistedClaimDraft,
} from './claimDraft';
import { useClaimFormState } from './useClaimFormState';
jest.mock('src/features/ManageClaimAttachments/lib/heic', () => ({
  ...jest.requireActual('src/features/ManageClaimAttachments/lib/heic'),
  convertHeic: jest.fn(),
}));
const heic = (name: string) => new File(['heic'], name, { type: '', lastModified: 123 });
const jpeg = new File(['jpeg data'], 'one.jpg', { type: 'image/jpeg', lastModified: 123 });
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(convertHeic).mockReset();
  jest.spyOn(window, 'scrollTo').mockImplementation();
});
afterEach(() => jest.restoreAllMocks());
test('converts sequentially across selections and retains source duplicate detection', async () => {
  const read = jest.spyOn(FileReader.prototype, 'readAsArrayBuffer');
  const deferred: { finish?: (file: File) => void } = {};
  jest
    .mocked(convertHeic)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          deferred.finish = resolve;
        }),
    )
    .mockResolvedValue(jpeg);
  const { result } = renderHook(useClaimFormState);
  const first = heic('one.HEIC');
  act(() => result.current.addFiles([first]));
  act(() => result.current.addFiles([heic('two.heif')]));
  await waitFor(() => expect(convertHeic).toHaveBeenCalledTimes(1));
  await act(async () => deferred.finish!(jpeg));
  await waitFor(() =>
    expect(result.current.formState.attachments.every((a) => a.status === 'selected')).toBe(true),
  );
  expect(convertHeic).toHaveBeenCalledTimes(2);
  expect(read).toHaveBeenCalledTimes(2);
  expect(result.current.formState.attachments[0]).toMatchObject({
    file: jpeg,
    fileName: 'one.jpg',
    mimeType: 'image/jpeg',
    size: jpeg.size,
  });
  act(() => result.current.addFiles([first]));
  expect(result.current.formState.attachments).toHaveLength(2);
  expect(convertHeic).toHaveBeenCalledTimes(2);
});

test('keeps failures in the draft and continues processing other photos', async () => {
  jest.mocked(convertHeic).mockRejectedValueOnce(new Error('bad HEIC')).mockResolvedValue(jpeg);
  const { result } = renderHook(useClaimFormState);
  await act(async () => result.current.addFiles([heic('bad.heic'), heic('good.heic')]));
  await waitFor(() =>
    expect(result.current.formState.attachments.map((a) => a.status)).toEqual([
      'error',
      'selected',
    ]),
  );
  const draft = toPersistedClaimDraft(result.current.formState);
  expect(isPersistedClaimDraft(draft)).toBe(true);
  expect(fromPersistedClaimDraft(draft).attachments[0].status).toBe('error');
  act(() => result.current.removeFile(result.current.formState.attachments[0].localId));
  expect(result.current.formState.attachments).toHaveLength(1);
});

test('aborts removed photos and does not reinsert their late results', async () => {
  const deferred: { finish?: (file: File) => void } = {};
  jest.mocked(convertHeic).mockImplementation(
    () =>
      new Promise((resolve) => {
        deferred.finish = resolve;
      }),
  );
  const { result } = renderHook(useClaimFormState);
  act(() => result.current.addFiles([heic('one.heic')]));
  await waitFor(() => expect(convertHeic).toHaveBeenCalledTimes(1));
  const signal = jest.mocked(convertHeic).mock.calls[0][1];
  expect(toPersistedClaimDraft(result.current.formState).attachments[0].status).toBe('error');
  act(() => result.current.removeFile(result.current.formState.attachments[0].localId));
  expect(signal.aborted).toBe(true);
  await act(async () => deferred.finish!(jpeg));
  expect(result.current.formState.attachments).toEqual([]);
});

test('ordinary JPEG files are copied without loading the converter', async () => {
  const read = jest.spyOn(FileReader.prototype, 'readAsArrayBuffer');
  const { result } = renderHook(useClaimFormState);
  act(() => result.current.addFiles([jpeg]));
  expect(convertHeic).not.toHaveBeenCalled();
  await waitFor(() => expect(result.current.formState.attachments[0].status).toBe('selected'));
  expect(result.current.formState.attachments[0].file).not.toBe(jpeg);
  expect(read).toHaveBeenCalledTimes(1);
  expect(convertHeic).not.toHaveBeenCalled();
});

test('marks an unreadable file and continues preparing the next attachment', async () => {
  jest.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementationOnce(function (
    this: FileReader,
  ) {
    Object.defineProperty(this, 'error', {
      value: new DOMException('File changed', 'NotReadableError'),
    });
    this.dispatchEvent(new ProgressEvent('error'));
  });
  const { result } = renderHook(useClaimFormState);
  act(() => result.current.addFiles([new File(['bad'], 'bad.jpg'), jpeg]));
  await waitFor(() =>
    expect(result.current.formState.attachments.map((a) => a.status)).toEqual([
      'error',
      'selected',
    ]),
  );
  expect(result.current.formState.attachments[0]).toMatchObject({
    errorReason: 'read',
    errorDetails: 'NotReadableError: File changed',
    file: undefined,
  });
  expect(isPersistedClaimDraft(toPersistedClaimDraft(result.current.formState))).toBe(true);
});
