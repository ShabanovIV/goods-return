import { FormField } from 'src/shared/ui/FormField';
import { Textarea } from 'src/shared/ui/Textarea';

const DESCRIPTION_MAX_LENGTH = 1000;

type ClaimDescriptionFieldProps = {
  description: string;
  onChange: (description: string) => void;
  showErrors: boolean;
};

export const ClaimDescriptionField = ({
  description,
  onChange,
  showErrors,
}: ClaimDescriptionFieldProps) => {
  const isEmpty = !description.trim();
  const isTooLong = description.length > DESCRIPTION_MAX_LENGTH;
  const error = showErrors
    ? isEmpty
      ? 'Опишите суть претензии.'
      : isTooLong
        ? 'Суть претензии должна быть не длиннее 1000 символов.'
        : ''
    : '';

  return (
    <FormField error={error} htmlFor="claim-description" label="Суть претензии">
      <Textarea
        id="claim-description"
        value={description}
        maxLength={DESCRIPTION_MAX_LENGTH}
        placeholder="Опишите ситуацию и важные детали"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'claim-description-error' : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
};
