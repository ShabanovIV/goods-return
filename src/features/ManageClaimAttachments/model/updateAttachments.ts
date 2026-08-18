import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { getAttachmentFingerprint, getFileFingerprint } from './attachmentFingerprint';

type AddSelectedFilesArguments = {
  attachments: ClaimAttachment[];
  files: FileList;
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

  Array.from(files).forEach((file) => {
    const fingerprint = getFileFingerprint(file);
    const existingIndex = nextAttachments.findIndex(
      (attachment) => getAttachmentFingerprint(attachment) === fingerprint,
    );
    const existing = existingIndex >= 0 ? nextAttachments[existingIndex] : undefined;

    if ((existing && existing.status !== 'needs-file') || processedFingerprints.has(fingerprint)) {
      duplicateNames.push(file.name);
      return;
    }

    const attachment: ClaimAttachment = {
      localId: existing?.localId ?? createLocalId(),
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
    if (existingIndex >= 0) nextAttachments[existingIndex] = attachment;
    else nextAttachments.push(attachment);
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
