import { readAttachmentFile } from './readAttachmentFile';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

test('reads before metadata and creates an independent copy with the same contents', async () => {
  const source = new File(['photo contents'], 'photo.jpg', { type: 'image/jpeg' });
  const events: string[] = [];
  const originalRead = FileReader.prototype.readAsArrayBuffer;
  jest.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementation(function (
    this: FileReader,
    file,
  ) {
    events.push('read');
    originalRead.call(this, file);
  });
  Object.defineProperty(source, 'lastModified', {
    get: () => {
      events.push('metadata');
      return 123;
    },
  });
  const copy = await readAttachmentFile(source, new AbortController().signal);
  expect(events[0]).toBe('read');
  expect(copy).not.toBe(source);
  expect(copy.name).toBe('photo.jpg');
  expect(copy.type).toBe('image/jpeg');
  expect(copy.lastModified).toBe(123);
  const contents = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(copy);
  });
  expect(contents).toBe('photo contents');
});

test('rejects unreadable files', async () => {
  jest.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementation(() => {
    throw new DOMException('Cannot read', 'NotReadableError');
  });
  await expect(
    readAttachmentFile(new File([], 'bad.jpg'), new AbortController().signal),
  ).rejects.toHaveProperty('name', 'NotReadableError');
});

test('aborts a stalled read after thirty seconds', async () => {
  jest.useFakeTimers();
  jest.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementation(() => {});
  const abort = jest.spyOn(FileReader.prototype, 'abort').mockImplementation(function (
    this: FileReader,
  ) {
    this.dispatchEvent(new ProgressEvent('abort'));
  });
  const result = readAttachmentFile(new File([], 'slow.jpg'), new AbortController().signal);
  const assertion = expect(result).rejects.toHaveProperty('name', 'AbortError');
  jest.advanceTimersByTime(30_000);
  await assertion;
  expect(abort).toHaveBeenCalledTimes(1);
});
