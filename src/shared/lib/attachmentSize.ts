type SizedAttachment = { size: number; file?: { size: number } };

export const getAttachmentsSize = (attachments: readonly SizedAttachment[]) =>
  attachments.reduce((total, attachment) => total + (attachment.file?.size ?? attachment.size), 0);

export const exceedsAttachmentsLimit = (attachments: readonly SizedAttachment[]) =>
  getAttachmentsSize(attachments) > __MAX_ATTACHMENTS_SIZE_BYTES__;

export const formatAttachmentsSize = (bytes: number) =>
  `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(bytes / (1024 * 1024))} МБ`;

export const getAttachmentsLimitMessage = () =>
  `Общий размер вложений превышает ${formatAttachmentsSize(__MAX_ATTACHMENTS_SIZE_BYTES__)}. Удалите часть файлов или выберите файлы меньшего размера.`;
