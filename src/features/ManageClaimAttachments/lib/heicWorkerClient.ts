export const convertInWorker = (file: File, signal: AbortSignal): Promise<File> =>
  new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new Error('Conversion cancelled'));
    const worker = new Worker(new URL('./heic.worker.ts', import.meta.url));
    const finish = () => {
      worker.terminate();
      clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
    };
    const fail = () => {
      finish();
      reject(new Error('HEIC conversion failed'));
    };
    const abort = () => fail();
    const timeout = setTimeout(fail, 120_000);
    signal.addEventListener('abort', abort, { once: true });
    worker.onerror = fail;
    worker.onmessageerror = fail;
    worker.onmessage = ({ data }: MessageEvent<Blob | null>) => {
      if (!(data instanceof Blob) || !data.size || data.type !== 'image/jpeg') return fail();
      finish();
      resolve(
        new File([data], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, {
          type: 'image/jpeg',
          lastModified: file.lastModified,
        }),
      );
    };
    worker.postMessage(file);
  });
