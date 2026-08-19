import type { ClaimFlaw } from 'src/entities/Claim';
import { FormField } from 'src/shared/ui/FormField';
import { Select } from 'src/shared/ui/Select';
import { DictionaryError } from './DictionaryError';

type FlawSelectorProps = {
  enabled: boolean;
  errorMessage?: string;
  flawId: string;
  flaws: ClaimFlaw[];
  isLoading: boolean;
  onChange: (flawId: string) => void;
  onRetry: () => void;
  showErrors: boolean;
};

export const FlawSelector = ({
  enabled,
  errorMessage,
  flawId,
  flaws,
  isLoading,
  onChange,
  onRetry,
  showErrors,
}: FlawSelectorProps) => {
  const hasError = showErrors && enabled && flaws.length > 0 && !flawId && !errorMessage;
  const placeholder = !enabled
    ? 'Сначала выберите причину'
    : isLoading
      ? 'Загружаем недостатки…'
      : flaws.length
        ? 'Выберите недостаток'
        : 'Недостатки не найдены';

  return (
    <FormField
      error={hasError ? 'Выберите недостаток.' : ''}
      htmlFor="claim-flaw"
      label="Недостаток"
    >
      {errorMessage ? (
        <DictionaryError message={errorMessage} onRetry={onRetry} />
      ) : (
        <Select
          id="claim-flaw"
          value={flawId}
          disabled={!enabled || isLoading || flaws.length === 0}
          options={flaws.map((flaw) => ({ label: flaw.name, value: flaw.id }))}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? 'claim-flaw-error' : undefined}
          onChange={onChange}
        />
      )}
    </FormField>
  );
};
