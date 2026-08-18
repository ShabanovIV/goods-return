import type { ClaimFlaw } from 'src/entities/Claim';
import s from './ClaimFormPage.module.scss';
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
  <fieldset className={s.flawFieldset} disabled={!enabled || isLoading}>
    <legend>Недостатки товара</legend>
    {!enabled && <p>Сначала выберите причину обращения.</p>}
    {enabled && isLoading && <p>Обновляем список недостатков…</p>}
    {errorMessage && <DictionaryError message={errorMessage} onRetry={onRetry} />}
    {!isLoading && !errorMessage && enabled && flaws.length === 0 && (
      <p>Для выбранных товаров недостатки не найдены.</p>
    )}
    <div className={s.optionGrid}>
      {flaws.map((flaw) => (
        <label className={s.checkOption} key={flaw.id}>
          <input
            type="checkbox"
            checked={flawIds.includes(flaw.id)}
            onChange={() => onToggle(flaw.id)}
          />
          <span className={s.customCheckbox} aria-hidden="true">
            {flawIds.includes(flaw.id) ? '✓' : ''}
          </span>
          <span>{flaw.name}</span>
        </label>
      ))}
    </div>
    {showErrors && flaws.length > 0 && flawIds.length === 0 && (
      <span className={s.inputError}>Выберите хотя бы один недостаток.</span>
    )}
  </fieldset>
);
