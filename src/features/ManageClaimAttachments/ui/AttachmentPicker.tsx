import type { AttachmentType } from 'src/entities/Claim';
import { Alert } from 'src/shared/ui/Alert';
import { Button } from 'src/shared/ui/Button';
import { FormField } from 'src/shared/ui/FormField';
import { Select } from 'src/shared/ui/Select';
import styles from './AttachmentsStep.module.scss';
type AttachmentPickerProps = {
  attachmentTypes: AttachmentType[];
  isTypesLoading: boolean;
  onFilesSelected: (files: readonly File[]) => void;
  onRetryTypes: () => void;
  onTypeChange: (type: string) => void;
  selectedType: string;
  typesError?: string;
};

type FileActionProps = {
  disabled: boolean;
  label: string;
  multiple?: boolean;
  onFilesSelected: (files: readonly File[]) => void;
  symbol: string;
};

const FileAction = ({ disabled, label, multiple, onFilesSelected, symbol }: FileActionProps) => (
  <label className={`${styles.fileButton} ${disabled ? styles.fileButtonDisabled : ''}`}>
    <span aria-hidden="true">{symbol}</span>
    {label}
    <input
      type="file"
      disabled={disabled}
      multiple={multiple}
      onChange={(event) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = '';
        if (files.length) onFilesSelected(files);
      }}
    />
  </label>
);

export const AttachmentPicker = ({
  attachmentTypes,
  isTypesLoading,
  onFilesSelected,
  onRetryTypes,
  onTypeChange,
  selectedType,
  typesError,
}: AttachmentPickerProps) => {
  if (typesError) {
    return (
      <Alert
        action={
          <Button size="small" variant="secondary" onClick={onRetryTypes}>
            Повторить
          </Button>
        }
      >
        {typesError}
      </Alert>
    );
  }

  const disabled = isTypesLoading || (!selectedType && attachmentTypes.length > 0);
  return (
    <div className={styles.uploadPanel}>
      {attachmentTypes.length > 0 && (
        <FormField htmlFor="attachment-type" label="Тип вложения">
          <Select
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
          </Select>
        </FormField>
      )}
      <div className={styles.uploadActions}>
        <FileAction
          disabled={disabled}
          label="Выбрать файлы"
          multiple
          onFilesSelected={onFilesSelected}
          symbol="＋"
        />
      </div>
      <p className={styles.uploadHint}>
        Файлы пока остаются на устройстве и отправятся одной группой после подтверждения претензии.
        Ограничения по формату и размеру определяет сервер.
      </p>
    </div>
  );
};
