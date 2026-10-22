export const isHeicFile = (file: Pick<File, 'name' | 'type'>) =>
  /\.(heic|heif)$/i.test(file.name) || /^image\/(heic|heif)(-sequence)?$/i.test(file.type);

export const convertHeic = async (file: File, signal: AbortSignal) => {
  const { convertInWorker } = await import('./heicWorkerClient');
  return convertInWorker(file, signal);
};
