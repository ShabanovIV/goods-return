import type { ClaimAttachment } from 'src/entities/Claim';

export const getFileFingerprint = (file: Pick<File, 'lastModified' | 'name' | 'size'>) =>
  `${file.name}:${file.size}:${file.lastModified}`;

export const getAttachmentFingerprint = (
  attachment: Pick<ClaimAttachment, 'fileName' | 'lastModified' | 'size'>,
) => `${attachment.fileName}:${attachment.size}:${attachment.lastModified}`;
