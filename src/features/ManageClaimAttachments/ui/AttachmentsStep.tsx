import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { Alert } from 'src/shared/ui/Alert';
import { Button } from 'src/shared/ui/Button';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import styles from './AttachmentsStep.module.scss';
import { AttachmentTypeRow } from './AttachmentTypeRow';

type AttachmentsStepProps = {
  attachments: ClaimAttachment[];
  attachmentTypes: AttachmentType[];
  isTypesLoading: boolean;
  typesError?: string;
  showErrors: boolean;
  onFilesSelected: (attachmentType: AttachmentType, files: readonly File[]) => void;
  onRetryTypes: () => void;
  onRemoveAttachment: (localId: string) => void;
};

export const AttachmentsStep = ({
  attachments,
  attachmentTypes,
  isTypesLoading,
  typesError,
  showErrors,
  onFilesSelected,
  onRetryTypes,
  onRemoveAttachment,
}: AttachmentsStepProps) => (
  <FormStep
    description="Добавьте файлы отдельно для каждого подходящего типа."
    step={3}
    title="Добавьте подтверждающие файлы"
    titleId="attachments-title"
  >
    {typesError && (
      <Alert
        action={
          <Button size="small" variant="secondary" onClick={onRetryTypes}>
            Повторить
          </Button>
        }
      >
        {typesError}
      </Alert>
    )}
    {isTypesLoading && <p className={styles.stepMessage}>Загружаем типы вложений…</p>}
    {!isTypesLoading && !typesError && attachmentTypes.length === 0 && (
      <p className={styles.stepMessage}>Типы вложений не найдены.</p>
    )}
    {!typesError && attachmentTypes.length > 0 && (
      <div className={styles.typeRows}>
        <List
          items={attachmentTypes}
          getKey={(attachmentType) => attachmentType.order}
          renderItem={(attachmentType) => (
            <AttachmentTypeRow
              attachmentType={attachmentType}
              attachments={attachments.filter(
                (attachment) => attachment.attachmentTypeOrder === attachmentType.order,
              )}
              onFilesSelected={onFilesSelected}
              onRemoveAttachment={onRemoveAttachment}
              showErrors={showErrors}
            />
          )}
        />
      </div>
    )}
    <p className={styles.uploadHint}>
      Выбранные файлы не сохраняются после перезагрузки страницы и отправятся одной группой после
      подтверждения претензии.
    </p>
  </FormStep>
);
