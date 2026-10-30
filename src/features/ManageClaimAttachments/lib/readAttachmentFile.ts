export const readAttachmentFile = (file: File, signal: AbortSignal): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    const timer = setTimeout(abort, 30_000);
    const cleanup = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    };

    reader.onload = () => {
      cleanup();
      try {
        if (!(reader.result instanceof ArrayBuffer) || reader.result.byteLength !== file.size) {
          reject(new Error('Не удалось прочитать файл полностью.'));
          return;
        }
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
      reject(reader.error ?? new Error('Не удалось прочитать файл'));
    };
    reader.onabort = () => {
      cleanup();
      reject(new DOMException('Чтение отменено или превышено время ожидания', 'AbortError'));
    };
    if (signal.aborted) {
      cleanup();
      reject(new DOMException('Чтение отменено', 'AbortError'));
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    try {
      // Start reading before accessing metadata: Android providers can return stale snapshots.
      reader.readAsArrayBuffer(file);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
