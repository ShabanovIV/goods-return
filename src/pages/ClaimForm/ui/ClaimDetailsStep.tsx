/* eslint-disable max-lines */
import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import { Button } from 'src/shared/ui/buttons/Button/Button';
import s from './ClaimFormPage.module.scss';

type DictionaryState<T> = {
  items: T[];
  isLoading: boolean;
  errorMessage?: string;
  retry: () => void;
};

type ClaimDetailsStepProps = {
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  reasons: DictionaryState<ClaimDictionaryItem>;
  demands: DictionaryState<ClaimDictionaryItem>;
  flaws: DictionaryState<ClaimFlaw>;
  flawsEnabled: boolean;
  showErrors: boolean;
  onReasonChange: (reasonId: string) => void;
  onDemandChange: (demandId: string) => void;
  onFlawToggle: (flawId: string) => void;
};

type DictionaryErrorProps = {
  message: string;
  onRetry: () => void;
};

const DictionaryError = ({ message, onRetry }: DictionaryErrorProps) => (
  <div className={s.dictionaryError} role="alert">
    <span>{message}</span>
    <Button type="button" variant="secondary" onClick={onRetry}>
      Повторить
    </Button>
  </div>
);

export const ClaimDetailsStep = ({
  reasonId,
  clientDemandId,
  flawIds,
  reasons,
  demands,
  flaws,
  flawsEnabled,
  showErrors,
  onReasonChange,
  onDemandChange,
  onFlawToggle,
}: ClaimDetailsStepProps) => (
  <section className={s.stepSection} aria-labelledby="claim-title">
    <div className={s.sectionHeading}>
      <p className={s.eyebrow}>Шаг 2 из 4</p>
      <h1 id="claim-title">Расскажите, что произошло</h1>
      <p>Ответы помогут быстрее передать обращение нужному специалисту.</p>
    </div>

    <div className={s.formFields}>
      <div className={s.formField}>
        <label htmlFor="claim-reason">Причина обращения</label>
        {reasons.errorMessage ? (
          <DictionaryError message={reasons.errorMessage} onRetry={reasons.retry} />
        ) : (
          <select
            id="claim-reason"
            value={reasonId}
            disabled={reasons.isLoading}
            aria-invalid={showErrors && !reasonId}
            onChange={(event) => onReasonChange(event.target.value)}
          >
            <option value="">
              {reasons.isLoading ? 'Загружаем причины…' : 'Выберите причину'}
            </option>
            {reasons.items.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.name}
              </option>
            ))}
          </select>
        )}
        {showErrors && !reasonId && !reasons.errorMessage && (
          <span className={s.inputError}>Выберите причину обращения.</span>
        )}
      </div>

      <div className={s.formField}>
        <label htmlFor="client-demand">Какого решения вы ожидаете?</label>
        {demands.errorMessage ? (
          <DictionaryError message={demands.errorMessage} onRetry={demands.retry} />
        ) : (
          <select
            id="client-demand"
            value={clientDemandId}
            disabled={demands.isLoading}
            aria-invalid={showErrors && !clientDemandId}
            onChange={(event) => onDemandChange(event.target.value)}
          >
            <option value="">
              {demands.isLoading ? 'Загружаем варианты…' : 'Выберите вариант'}
            </option>
            {demands.items.map((demand) => (
              <option key={demand.id} value={demand.id}>
                {demand.name}
              </option>
            ))}
          </select>
        )}
        {showErrors && !clientDemandId && !demands.errorMessage && (
          <span className={s.inputError}>Выберите ожидаемое решение.</span>
        )}
      </div>

      <fieldset className={s.flawFieldset} disabled={!flawsEnabled || flaws.isLoading}>
        <legend>Недостатки товара</legend>
        {!flawsEnabled && <p>Сначала выберите причину обращения.</p>}
        {flawsEnabled && flaws.isLoading && <p>Обновляем список недостатков…</p>}
        {flaws.errorMessage && (
          <DictionaryError message={flaws.errorMessage} onRetry={flaws.retry} />
        )}
        {!flaws.isLoading && !flaws.errorMessage && flawsEnabled && flaws.items.length === 0 && (
          <p>Для выбранных товаров недостатки не найдены.</p>
        )}
        <div className={s.optionGrid}>
          {flaws.items.map((flaw) => (
            <label className={s.checkOption} key={flaw.id}>
              <input
                type="checkbox"
                checked={flawIds.includes(flaw.id)}
                onChange={() => onFlawToggle(flaw.id)}
              />
              <span className={s.customCheckbox} aria-hidden="true">
                {flawIds.includes(flaw.id) ? '✓' : ''}
              </span>
              <span>{flaw.name}</span>
            </label>
          ))}
        </div>
        {showErrors && flaws.items.length > 0 && flawIds.length === 0 && (
          <span className={s.inputError}>Выберите хотя бы один недостаток.</span>
        )}
      </fieldset>
    </div>
  </section>
);
