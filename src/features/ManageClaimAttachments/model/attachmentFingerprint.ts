import type { ClaimAttachment } from 'src/entities/Claim';

export const getFileFingerprint = (file: Pick<File, 'name' | 'size'>) =>
  `${file.name}:${file.size}`;

export const getAttachmentFingerprint = (
  attachment: Pick<ClaimAttachment, 'fileName' | 'size' | 'sourceFingerprint'>,
) => attachment.sourceFingerprint ?? `${attachment.fileName}:${attachment.size}`;
