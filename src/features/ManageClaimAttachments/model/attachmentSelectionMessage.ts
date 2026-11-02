import { formatAttachmentsSize } from 'src/shared/lib/attachmentSize';

export type RejectedAttachment = {
  inputIndex: number;
  fileName: string;
  reason: 'duplicate' | 'invalidType' | 'sizeLimit';
};

export const getAttachmentSelectionMessage = (
  rejected: RejectedAttachment[],
  addedCount: number,
  typeName = 'Файл',
): string | undefined => {
  if (!rejected.length) return undefined;
  const names = (reason: RejectedAttachment['reason']) =>
    rejected.filter((item) => item.reason === reason).map((item) => `«${item.fileName}»`);
  const duplicates = names('duplicate');
  const invalid = names('invalidType');
  const oversized = names('sizeLimit');
  const limit = formatAttachmentsSize(__MAX_ATTACHMENTS_SIZE_BYTES__);
  const messages = [
    duplicates.length
      ? duplicates.length === 1
        ? `Файл ${duplicates[0]} уже добавлен.`
        : `Добавлены ранее: ${duplicates.join(', ')}.`
      : '',
    invalid.length
      ? invalid.length === 1
        ? `Файл ${invalid[0]} не соответствует типу «${typeName}».`
        : `Не соответствуют типу «${typeName}»: ${invalid.join(', ')}.`
      : '',
    oversized.length ? `Не помещаются в общий лимит ${limit}: ${oversized.join(', ')}.` : '',
  ].filter(Boolean);
  if (rejected.length > 1) {
    messages.unshift(
      addedCount ? 'Некоторые файлы не прикреплены.' : 'Выбранные файлы не прикреплены.',
    );
  }
  return messages.join('\n');
};
