import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { FormStep } from 'src/shared/ui/FormStep';
import { AttachmentList } from './AttachmentList';
import { AttachmentPicker } from './AttachmentPicker';
import { AttachmentRequirements } from './AttachmentRequirements';

type AttachmentsStepProps = {
  attachments: ClaimAttachment[];
  attachmentTypes: AttachmentType[];
  selectedType: string;
  isTypesLoading: boolean;
  typesError?: string;
  showErrors: boolean;
  onTypeChange: (type: string) => void;
  onFilesSelected: (files: readonly File[]) => void;
  onRetryTypes: () => void;
  onRemoveAttachment: (localId: string) => void;
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
}: AttachmentsStepProps) => (
  <FormStep
    description="Фотографии и видео помогут быстрее разобраться в ситуации."
    step={3}
    title="Добавьте подтверждающие файлы"
    titleId="attachments-title"
  >
    <AttachmentPicker
      attachmentTypes={attachmentTypes}
      isTypesLoading={isTypesLoading}
      onFilesSelected={onFilesSelected}
      onRetryTypes={onRetryTypes}
      onTypeChange={onTypeChange}
      selectedType={selectedType}
      typesError={typesError}
    />
    <AttachmentRequirements
      attachmentTypes={attachmentTypes}
      attachments={attachments}
      showErrors={showErrors}
    />
    <AttachmentList attachments={attachments} onRemoveAttachment={onRemoveAttachment} />
  </FormStep>
);
