import type { ClaimAttachment } from 'src/entities/Claim';
import { Button } from 'src/shared/ui/Button';
import { List } from 'src/shared/ui/List';
import s from './ClaimFormPage.module.scss';

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} КБ`;
  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
};

const statusText: Record<ClaimAttachment['status'], string> = {
  selected: 'Выбран · отправится с претензией',
  uploaded: 'Отправлен',
  'needs-file': 'Нужно выбрать заново',
};

type AttachmentListProps = {
  attachments: ClaimAttachment[];
  onRemoveAttachment: (localId: string) => void;
};

export const AttachmentList = ({ attachments, onRemoveAttachment }: AttachmentListProps) => (
  <div className={s.attachmentList} aria-live="polite">
    {attachments.length === 0 ? (
      <div className={s.emptyAttachments}>
        <span aria-hidden="true">⌁</span>
        <p>Здесь появятся добавленные файлы.</p>
      </div>
    ) : (
      <List
        items={attachments}
        getKey={(attachment) => attachment.localId}
        renderItem={(attachment) => (
          <article className={s.attachmentCard}>
            <div className={s.fileIcon} aria-hidden="true">
              {attachment.mimeType.startsWith('image/') ? 'IMG' : 'FILE'}
            </div>
            <div className={s.attachmentInfo}>
              <strong>{attachment.fileName}</strong>
              <span>
                {formatFileSize(attachment.size)}
                {attachment.attachmentTypeName ? ` · ${attachment.attachmentTypeName}` : ''}
              </span>
              <span className={s[`status-${attachment.status}`]}>
                {statusText[attachment.status]}
              </span>
            </div>
            <div className={s.attachmentActions}>
              <Button
                aria-label={`Удалить ${attachment.fileName}`}
                size="small"
                variant="text"
                onClick={() => onRemoveAttachment(attachment.localId)}
              >
                Удалить
              </Button>
            </div>
          </article>
        )}
      />
    )}
  </div>
);
