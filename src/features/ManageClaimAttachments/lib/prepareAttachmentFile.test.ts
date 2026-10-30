import { convertHeic } from './heic';
import { prepareAttachmentFile } from './prepareAttachmentFile';
import { readAttachmentFile } from './readAttachmentFile';

jest.mock('./heic', () => ({
  ...jest.requireActual('./heic'),
  convertHeic: jest.fn(),
}));

afterEach(() => jest.restoreAllMocks());

test('creates an independent file with the original bytes and metadata', async () => {
  const original = new File(['photo bytes'], 'photo.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const signal = new AbortController().signal;
  const result = await prepareAttachmentFile(original, signal);
  expect(result.file).not.toBe(original);
  expect(result.file).toMatchObject({
    name: original.name,
    size: original.size,
    type: original.type,
    lastModified: original.lastModified,
  });
  const reader = new FileReader();
  const contents = new Promise((resolve) => {
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsText(result.file!);
  expect(await contents).toBe('photo bytes');
});

test('reports the original read failure without retaining the inaccessible file', async () => {
  jest.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementation(function (
    this: FileReader,
  ) {
    Object.defineProperty(this, 'error', {
      value: new DOMException('File changed', 'NotReadableError'),
    });
    this.dispatchEvent(new ProgressEvent('error'));
  });
  const result = await prepareAttachmentFile(
    new File(['x'], 'photo.jpg'),
    new AbortController().signal,
  );
  expect(result).toEqual({ errorReason: 'read', errorDetails: 'NotReadableError: File changed' });
});

test('converts HEIC only after reading it into a separate file', async () => {
  const original = new File(['heic'], 'photo.heic');
  const jpeg = new File(['jpeg'], 'photo.jpg', { type: 'image/jpeg' });
  jest.mocked(convertHeic).mockResolvedValueOnce(jpeg);
  const result = await prepareAttachmentFile(original, new AbortController().signal);
  expect(jest.mocked(convertHeic).mock.calls.at(-1)?.[0]).not.toBe(original);
  expect(result.file).toBe(jpeg);
});

test('keeps conversion failures distinct from read failures', async () => {
  jest.mocked(convertHeic).mockRejectedValueOnce(new Error('Invalid HEIC'));
  expect(
    await prepareAttachmentFile(new File(['bad'], 'photo.heic'), new AbortController().signal),
  ).toEqual({ errorReason: 'conversion', errorDetails: 'Error: Invalid HEIC' });
});

test('aborts reading when an attachment is removed', async () => {
  const controller = new AbortController();
  const reading = readAttachmentFile(new File(['video'], 'video.mp4'), controller.signal);
  controller.abort();
  await expect(reading).rejects.toMatchObject({ name: 'AbortError' });
});
