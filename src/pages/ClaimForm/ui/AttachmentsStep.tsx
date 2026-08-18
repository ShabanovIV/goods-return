/* eslint-disable max-lines */
import type { AttachmentType } from 'src/entities/Claim';
import { Button } from 'src/shared/ui/buttons/Button/Button';
import s from './ClaimFormPage.module.scss';
import type { ClaimAttachment } from '../model/claimForm';

type AttachmentsStepProps = {
  attachments: ClaimAttachment[];
  attachmentTypes: AttachmentType[];
  selectedType: string;
  isTypesLoading: boolean;
  typesError?: string;
  showErrors: boolean;
  onTypeChange: (type: string) => void;
  onFilesSelected: (files: FileList) => void;
  onRetryTypes: () => void;
  onRemoveAttachment: (localId: string) => void;
};

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

export const AttachmentsStep = ({
  attachments,
  attachmentTypes,
  selectedType,
  isTypesLoading,
  typesError,
  showErrors,
  onTypeChange,
  onFilesSelected,
  onRetryTypes,
  onRemoveAttachment,
}: AttachmentsStepProps) => {
  const readyAttachments = attachments.filter((item) => item.status !== 'needs-file');

  return (
    <section className={s.stepSection} aria-labelledby="attachments-title">
      <div className={s.sectionHeading}>
        <p className={s.eyebrow}>Шаг 3 из 4</p>
        <h1 id="attachments-title">Добавьте подтверждающие файлы</h1>
        <p>Фотографии и видео помогут быстрее разобраться в ситуации.</p>
      </div>

      {typesError ? (
        <div className={s.dictionaryError} role="alert">
          <span>{typesError}</span>
          <Button type="button" variant="secondary" onClick={onRetryTypes}>
            Повторить
          </Button>
        </div>
      ) : (
        <div className={s.uploadPanel}>
          {attachmentTypes.length > 0 && (
            <div className={s.formField}>
              <label htmlFor="attachment-type">Тип вложения</label>
              <select
                id="attachment-type"
                value={selectedType}
                disabled={isTypesLoading}
                onChange={(event) => onTypeChange(event.target.value)}
              >
                <option value="">{isTypesLoading ? 'Загружаем типы…' : 'Выберите тип'}</option>
                {attachmentTypes.map((type) => (
                  <option key={type.order} value={type.order}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={s.uploadActions}>
            <label
              className={`${s.fileButton} ${isTypesLoading || (!selectedType && attachmentTypes.length > 0) ? s.fileButtonDisabled : ''}`}
            >
              <span aria-hidden="true">＋</span>
              Выбрать файлы
              <input
                type="file"
                multiple
                disabled={isTypesLoading || (!selectedType && attachmentTypes.length > 0)}
                onChange={(event) => {
                  if (event.target.files?.length) onFilesSelected(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
            <label
              className={`${s.fileButtonSecondary} ${isTypesLoading || (!selectedType && attachmentTypes.length > 0) ? s.fileButtonDisabled : ''}`}
            >
              <span aria-hidden="true">◎</span>
              Снять фото
              <input
                type="file"
                accept="image/*"
                capture="environment"
                disabled={isTypesLoading || (!selectedType && attachmentTypes.length > 0)}
                onChange={(event) => {
                  if (event.target.files?.length) onFilesSelected(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
          </div>

          <p className={s.uploadHint}>
            Файлы пока остаются на устройстве и отправятся одной группой после подтверждения
            претензии. Ограничения по формату и размеру определяет сервер.
          </p>
        </div>
      )}

      {showErrors &&
        attachmentTypes.some((type) => type.minAmount > 0) &&
        attachmentTypes.some(
          (type) =>
            readyAttachments.filter((item) => item.attachmentTypeOrder === type.order).length <
            type.minAmount,
        ) && (
          <div className={s.fieldError} role="alert">
            Добавьте обязательные вложения, указанные ниже.
          </div>
        )}

      {attachmentTypes.some((type) => type.minAmount > 0) && (
        <div className={s.requirements}>
          <strong>Обязательные материалы</strong>
          <ul>
            {attachmentTypes
              .filter((type) => type.minAmount > 0)
              .map((type) => {
                const currentAmount = readyAttachments.filter(
                  (item) => item.attachmentTypeOrder === type.order,
                ).length;
                return (
                  <li key={type.order}>
                    {type.name}: {currentAmount} из {type.minAmount}
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      <div className={s.attachmentList} aria-live="polite">
        {attachments.length === 0 ? (
          <div className={s.emptyAttachments}>
            <span aria-hidden="true">⌁</span>
            <p>Здесь появятся добавленные файлы.</p>
          </div>
        ) : (
          attachments.map((attachment) => (
            <article className={s.attachmentCard} key={attachment.localId}>
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
                <button
                  type="button"
                  aria-label={`Удалить ${attachment.fileName}`}
                  onClick={() => onRemoveAttachment(attachment.localId)}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
