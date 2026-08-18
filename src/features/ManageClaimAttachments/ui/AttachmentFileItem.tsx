import type { ClaimAttachment } from 'src/entities/Claim';
import { Button } from 'src/shared/ui/Button';
import styles from './AttachmentsStep.module.scss';

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} КБ`;
  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
};

const statusText: Record<ClaimAttachment['status'], string> = {
  selected: 'Выбран · отправится с претензией',
  uploaded: 'Отправлен',
};

type AttachmentFileItemProps = {
  attachment: ClaimAttachment;
  onRemove: (localId: string) => void;
};

export const AttachmentFileItem = ({ attachment, onRemove }: AttachmentFileItemProps) => (
  <li className={styles.fileItem}>
    <div className={styles.fileIcon} aria-hidden="true">
      {attachment.mimeType.startsWith('image/') ? 'IMG' : 'FILE'}
    </div>
    <div className={styles.fileInfo}>
      <strong>{attachment.fileName}</strong>
      <span>{formatFileSize(attachment.size)}</span>
      <span className={styles[`status-${attachment.status}`]}>{statusText[attachment.status]}</span>
    </div>
    <Button
      aria-label={`Удалить ${attachment.fileName}`}
      size="small"
      variant="text"
      onClick={() => onRemove(attachment.localId)}
    >
      Удалить
    </Button>
  </li>
);
