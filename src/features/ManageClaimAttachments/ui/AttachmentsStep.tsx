import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { getAttachmentsSize } from 'src/shared/lib/attachmentSize';
import { Alert } from 'src/shared/ui/Alert';
import { AttachmentsSize } from 'src/shared/ui/AttachmentsSize';
import { Button } from 'src/shared/ui/Button';
import { ErrorMessage, type ErrorNotice } from 'src/shared/ui/ErrorMessage';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import styles from './AttachmentsStep.module.scss';
import { AttachmentTypeRow } from './AttachmentTypeRow';

type AttachmentsStepProps = {
  attachments: ClaimAttachment[];
  attachmentTypes: AttachmentType[];
  isTypesLoading: boolean;
  typesError?: ErrorNotice | string;
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
    <AttachmentsSize bytes={getAttachmentsSize(attachments)} />
    {typesError && (
      <Alert
        action={
          <Button size="small" variant="secondary" onClick={onRetryTypes}>
            Повторить
          </Button>
        }
      >
        <ErrorMessage notice={typesError} />
      </Alert>
    )}
    {isTypesLoading && <p className={styles.stepMessage}>Загружаем типы вложений…</p>}
    {!isTypesLoading && !typesError && attachmentTypes.length === 0 && (
      <p className={styles.stepMessage}>Для выбранных позиций прикреплять файлы не требуется.</p>
    )}
    {!isTypesLoading && !typesError && attachmentTypes.length > 0 && (
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
  </FormStep>
);
