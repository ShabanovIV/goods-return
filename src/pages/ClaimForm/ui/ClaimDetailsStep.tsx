import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import s from './ClaimFormPage.module.scss';
import { DictionaryError } from './DictionaryError';
import { FlawSelector } from './FlawSelector';

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

      <FlawSelector
        enabled={flawsEnabled}
        errorMessage={flaws.errorMessage}
        flawIds={flawIds}
        flaws={flaws.items}
        isLoading={flaws.isLoading}
        onRetry={flaws.retry}
        onToggle={onFlawToggle}
        showErrors={showErrors}
      />
    </div>
  </section>
);
