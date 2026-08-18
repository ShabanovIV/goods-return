import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { FieldError } from 'src/shared/ui/FieldError';
import { List } from 'src/shared/ui/List';
import { AttachmentFileItem } from './AttachmentFileItem';
import styles from './AttachmentsStep.module.scss';

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
        <label className={styles.addButton}>
          <span aria-hidden="true">+</span>
          <input
            aria-label={`Добавить файлы: ${attachmentType.name}`}
            type="file"
            multiple
            onChange={(event) => {
              const files = Array.from(event.currentTarget.files ?? []);
              event.currentTarget.value = '';
              if (files.length) onFilesSelected(attachmentType, files);
            }}
          />
        </label>
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
