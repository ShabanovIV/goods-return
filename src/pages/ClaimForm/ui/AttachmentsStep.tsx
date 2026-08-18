import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { AttachmentList } from './AttachmentList';
import { AttachmentPicker } from './AttachmentPicker';
import { AttachmentRequirements } from './AttachmentRequirements';
import s from './ClaimFormPage.module.scss';

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
  <section className={s.stepSection} aria-labelledby="attachments-title">
    <div className={s.sectionHeading}>
      <p className={s.eyebrow}>Шаг 3 из 4</p>
      <h1 id="attachments-title">Добавьте подтверждающие файлы</h1>
      <p>Фотографии и видео помогут быстрее разобраться в ситуации.</p>
    </div>
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
  </section>
);
