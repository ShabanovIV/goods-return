import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import CameraIcon from 'src/shared/assets/icons/camera.svg';
import { FieldError } from 'src/shared/ui/FieldError';
import { List } from 'src/shared/ui/List';
import { AttachmentFileItem } from './AttachmentFileItem';
import { AttachmentInput } from './AttachmentInput';
import styles from './AttachmentsStep.module.scss';
import { getAttachmentMediaType, getMediaAccept } from '../lib/attachmentMedia';

type AttachmentTypeRowProps = {
  attachmentType: AttachmentType;
  attachments: ClaimAttachment[];
  onFilesSelected: (attachmentType: AttachmentType, files: readonly File[]) => void;
  onRemoveAttachment: (localId: string) => void;
  showErrors: boolean;
};

export const AttachmentTypeRow = ({
  attachmentType,
  attachments,
  onFilesSelected,
  onRemoveAttachment,
  showErrors,
}: AttachmentTypeRowProps) => {
  const missingCount = Math.max(0, attachmentType.minAmount - attachments.length);
  const hasError = showErrors && missingCount > 0;
  const mediaType = getAttachmentMediaType(attachmentType);
  const accept = getMediaAccept(mediaType);
  const addFiles = (files: readonly File[]) => onFilesSelected(attachmentType, files);
  const captureLabel =
    mediaType === 'video'
      ? `Записать видео: ${attachmentType.name}`
      : `Сфотографировать: ${attachmentType.name}`;

  return (
    <section className={`${styles.typeRow} ${hasError ? styles.typeRowError : ''}`}>
      <div className={styles.typeRowHeader}>
        <div className={styles.typeInfo}>
          <strong>{attachmentType.name}</strong>
          <span>
            {attachmentType.minAmount > 0
              ? `Минимум: ${attachmentType.minAmount}`
              : 'Необязательно'}
          </span>
        </div>
        <div className={styles.attachmentActions}>
          <AttachmentInput
            accept={accept}
            ariaLabel={`Добавить файлы: ${attachmentType.name}`}
            className={styles.addButton}
            multiple
            onFilesSelected={addFiles}
          >
            <span aria-hidden="true">+</span>
          </AttachmentInput>
          {mediaType !== 'file' && (
            <AttachmentInput
              accept={accept}
              ariaLabel={captureLabel}
              capture="environment"
              className={styles.cameraButton}
              onFilesSelected={addFiles}
            >
              <CameraIcon aria-hidden="true" />
            </AttachmentInput>
          )}
        </div>
      </div>
      {attachments.length ? (
        <ul className={styles.fileList}>
          <List
            items={attachments}
            getKey={(attachment) => attachment.localId}
            renderItem={(attachment) => (
              <AttachmentFileItem attachment={attachment} onRemove={onRemoveAttachment} />
            )}
          />
        </ul>
      ) : (
        <p className={styles.emptyType}>Файлы не выбраны.</p>
      )}
      {hasError && <FieldError>Добавьте ещё файлов: {missingCount}.</FieldError>}
    </section>
  );
};
