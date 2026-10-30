// Read sequentially in the attachment queue so large files are not copied concurrently.
export const readAttachmentFile = (file: File, signal: AbortSignal): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    const cleanup = () => signal.removeEventListener('abort', abort);
    reader.onload = () => {
      cleanup();
      if (!(reader.result instanceof ArrayBuffer) || reader.result.byteLength !== file.size) {
        reject(new Error('Не удалось прочитать файл полностью.'));
        return;
      }
      try {
        resolve(
          new File([reader.result], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          }),
        );
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      cleanup();
      reject(reader.error ?? new Error('Не удалось прочитать файл.'));
    };
    reader.onabort = () => {
      cleanup();
      reject(new DOMException('Чтение отменено.', 'AbortError'));
    };
    if (signal.aborted) {
      reject(new DOMException('Чтение отменено.', 'AbortError'));
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    try {
      reader.readAsArrayBuffer(file);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
