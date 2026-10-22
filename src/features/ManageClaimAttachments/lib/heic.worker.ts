import { heicTo } from 'heic-to/next';

self.onmessage = async ({ data }: MessageEvent<File>) => {
  try {
    const jpeg = await heicTo({ blob: data, type: 'image/jpeg', quality: 1 });
    self.postMessage(jpeg);
  } catch {
    self.postMessage(null);
  }
};
