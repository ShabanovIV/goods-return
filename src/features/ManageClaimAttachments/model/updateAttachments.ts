import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { getAttachmentFingerprint, getFileFingerprint } from './attachmentFingerprint';

type AddSelectedFilesArguments = {
  attachments: ClaimAttachment[];
  files: readonly File[];
  attachmentType?: AttachmentType;
};

type AddSelectedFilesResult = {
  attachments: ClaimAttachment[];
  error?: string;
};

const createLocalId = () => crypto.randomUUID?.() ?? `file-${Date.now()}-${Math.random()}`;

export const addSelectedFiles = ({
  attachments,
  files,
  attachmentType,
}: AddSelectedFilesArguments): AddSelectedFilesResult => {
  const processedFingerprints = new Set<string>();
  const nextAttachments = [...attachments];
  const duplicateNames: string[] = [];

  files.forEach((file) => {
    const fingerprint = getFileFingerprint(file);
    const existing = nextAttachments.some(
      (attachment) => getAttachmentFingerprint(attachment) === fingerprint,
    );

    if (existing || processedFingerprints.has(fingerprint)) {
      duplicateNames.push(file.name);
      return;
    }

    const attachment: ClaimAttachment = {
      localId: createLocalId(),
      fileName: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      lastModified: file.lastModified,
      attachmentType: attachmentType?.type,
      attachmentTypeOrder: attachmentType?.order,
      attachmentTypeName: attachmentType?.name,
      status: 'selected',
      file,
    };

    processedFingerprints.add(fingerprint);
    nextAttachments.push(attachment);
  });

  return {
    attachments: nextAttachments,
    error: duplicateNames.length
      ? `Файл «${duplicateNames[duplicateNames.length - 1]}» уже добавлен.`
      : undefined,
  };
};

export const removeAttachment = (attachments: ClaimAttachment[], localId: string) =>
  attachments.filter((attachment) => attachment.localId !== localId);
