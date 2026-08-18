import type { AttachmentType } from 'src/entities/Claim';
import { Button } from 'src/shared/ui/buttons/Button';
import s from './ClaimFormPage.module.scss';

type AttachmentPickerProps = {
  attachmentTypes: AttachmentType[];
  isTypesLoading: boolean;
  onFilesSelected: (files: FileList) => void;
  onRetryTypes: () => void;
  onTypeChange: (type: string) => void;
  selectedType: string;
  typesError?: string;
};

type FileActionProps = {
  accept?: string;
  capture?: 'environment';
  disabled: boolean;
  label: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => void;
  secondary?: boolean;
  symbol: string;
};

const FileAction = ({
  accept,
  capture,
  disabled,
  label,
  multiple,
  onFilesSelected,
  secondary,
  symbol,
}: FileActionProps) => (
  <label
    className={`${secondary ? s.fileButtonSecondary : s.fileButton} ${disabled ? s.fileButtonDisabled : ''}`}
  >
    <span aria-hidden="true">{symbol}</span>
    {label}
    <input
      type="file"
      accept={accept}
      capture={capture}
      disabled={disabled}
      multiple={multiple}
      onChange={(event) => {
        if (event.target.files?.length) onFilesSelected(event.target.files);
        event.target.value = '';
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
      <div className={s.dictionaryError} role="alert">
        <span>{typesError}</span>
        <Button type="button" variant="secondary" onClick={onRetryTypes}>
          Повторить
        </Button>
      </div>
    );
  }

  const disabled = isTypesLoading || (!selectedType && attachmentTypes.length > 0);
  return (
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
        <FileAction
          disabled={disabled}
          label="Выбрать файлы"
          multiple
          onFilesSelected={onFilesSelected}
          symbol="＋"
        />
        <FileAction
          accept="image/*"
          capture="environment"
          disabled={disabled}
          label="Снять фото"
          onFilesSelected={onFilesSelected}
          secondary
          symbol="◎"
        />
      </div>
      <p className={s.uploadHint}>
        Файлы пока остаются на устройстве и отправятся одной группой после подтверждения претензии.
        Ограничения по формату и размеру определяет сервер.
      </p>
    </div>
  );
};
