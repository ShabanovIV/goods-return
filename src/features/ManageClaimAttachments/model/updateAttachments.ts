import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { exceedsAttachmentsLimit } from 'src/shared/lib/attachmentSize';
import { getAttachmentFingerprint, getFileFingerprint } from './attachmentFingerprint';
import {
  getAttachmentSelectionMessage,
  type RejectedAttachment,
} from './attachmentSelectionMessage';
import { getAttachmentMediaType, isFileAllowed } from '../lib/attachmentMedia';

type AddSelectedFilesArguments = {
  attachments: ClaimAttachment[];
  files: readonly File[];
  attachmentType?: AttachmentType;
};

type AddSelectedFilesResult = {
  attachments: ClaimAttachment[];
  added: { inputIndex: number; attachment: ClaimAttachment }[];
  rejected: RejectedAttachment[];
  error?: string;
};

const createLocalId = () => crypto.randomUUID?.() ?? `file-${Date.now()}-${Math.random()}`;

export const prepareSelectedAttachments = ({
  attachments,
  files,
  attachmentType,
}: AddSelectedFilesArguments): AddSelectedFilesResult => {
  const nextAttachments = [...attachments];
  const added: AddSelectedFilesResult['added'] = [];
  const rejected: RejectedAttachment[] = [];
  const mediaType = attachmentType ? getAttachmentMediaType(attachmentType) : 'file';

  files.forEach((file, inputIndex) => {
    if (!isFileAllowed(file, mediaType)) {
      rejected.push({ inputIndex, fileName: file.name, reason: 'invalidType' });
      return;
    }

    const fingerprint = getFileFingerprint(file);
    const existing = nextAttachments.some(
      (attachment) => getAttachmentFingerprint(attachment) === fingerprint,
    );

    if (existing) {
      rejected.push({ inputIndex, fileName: file.name, reason: 'duplicate' });
      return;
    }

    if (exceedsAttachmentsLimit([...nextAttachments, { size: file.size }])) {
      rejected.push({ inputIndex, fileName: file.name, reason: 'sizeLimit' });
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
      status: 'processing',
      sourceFingerprint: fingerprint,
      file,
    };

    added.push({ inputIndex, attachment });
    nextAttachments.push(attachment);
  });

  return {
    attachments: nextAttachments,
    added,
    rejected,
    error: getAttachmentSelectionMessage(rejected, added.length, attachmentType?.name),
  };
};

export const removeAttachment = (attachments: ClaimAttachment[], localId: string) =>
  attachments.filter((attachment) => attachment.localId !== localId);
