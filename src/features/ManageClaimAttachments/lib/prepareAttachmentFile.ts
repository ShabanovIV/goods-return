import { convertHeic, isHeicFile } from './heic';
import { readAttachmentFile } from './readAttachmentFile';

type PreparedAttachment =
  | { file: File; errorReason?: never; errorDetails?: never }
  | { file?: never; errorReason: 'read' | 'conversion'; errorDetails: string };

export const prepareAttachmentFile = async (
  original: File,
  signal: AbortSignal,
): Promise<PreparedAttachment> => {
  try {
    const copy = await readAttachmentFile(original, signal);
    if (signal.aborted) throw new DOMException('Обработка отменена.', 'AbortError');
    try {
      return { file: isHeicFile(copy) ? await convertHeic(copy, signal) : copy };
    } catch (error) {
      return {
        errorReason: 'conversion',
        errorDetails: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      };
    }
  } catch (error) {
    return {
      errorReason: 'read',
      errorDetails: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  }
};
