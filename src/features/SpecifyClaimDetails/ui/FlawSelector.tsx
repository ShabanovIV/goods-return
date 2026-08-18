import type { ClaimFlaw } from 'src/entities/Claim';
import { Checkbox } from 'src/shared/ui/Checkbox';
import { FieldError } from 'src/shared/ui/FieldError';
import { List } from 'src/shared/ui/List';
import styles from './ClaimDetailsStep.module.scss';
import { DictionaryError } from './DictionaryError';

type FlawSelectorProps = {
  enabled: boolean;
  errorMessage?: string;
  flawIds: string[];
  flaws: ClaimFlaw[];
  isLoading: boolean;
  onRetry: () => void;
  onToggle: (flawId: string) => void;
  showErrors: boolean;
};

export const FlawSelector = ({
  enabled,
  errorMessage,
  flawIds,
  flaws,
  isLoading,
  onRetry,
  onToggle,
  showErrors,
}: FlawSelectorProps) => (
  <fieldset className={styles.flawFieldset} disabled={!enabled || isLoading}>
    <legend>Недостатки товара</legend>
    {!enabled && <p>Сначала выберите причину обращения.</p>}
    {enabled && isLoading && <p>Обновляем список недостатков…</p>}
    {errorMessage && <DictionaryError message={errorMessage} onRetry={onRetry} />}
    {!isLoading && !errorMessage && enabled && flaws.length === 0 && (
      <p>Для выбранных товаров недостатки не найдены.</p>
    )}
    <div className={styles.optionGrid}>
      <List
        items={flaws}
        getKey={(flaw) => flaw.id}
        renderItem={(flaw) => (
          <label className={styles.checkOption}>
            <Checkbox checked={flawIds.includes(flaw.id)} onChange={() => onToggle(flaw.id)} />
            <span>{flaw.name}</span>
          </label>
        )}
      />
    </div>
    {showErrors && flaws.length > 0 && flawIds.length === 0 && (
      <FieldError>Выберите хотя бы один недостаток.</FieldError>
    )}
  </fieldset>
);
