import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import { FormField } from 'src/shared/ui/FormField';
import { FormStep } from 'src/shared/ui/FormStep';
import { Select } from 'src/shared/ui/Select';
import styles from './ClaimDetailsStep.module.scss';
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
  <FormStep
    description="Ответы помогут быстрее передать обращение нужному специалисту."
    step={2}
    title="Расскажите, что произошло"
    titleId="claim-title"
  >
    <div className={styles.formFields}>
      <FormField
        error={
          showErrors && !reasonId && !reasons.errorMessage ? 'Выберите причину обращения.' : ''
        }
        htmlFor="claim-reason"
        label="Причина обращения"
      >
        {reasons.errorMessage ? (
          <DictionaryError message={reasons.errorMessage} onRetry={reasons.retry} />
        ) : (
          <Select
            id="claim-reason"
            value={reasonId}
            disabled={reasons.isLoading}
            aria-invalid={showErrors && !reasonId}
            aria-describedby={showErrors && !reasonId ? 'claim-reason-error' : undefined}
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
          </Select>
        )}
      </FormField>
      <FormField
        error={
          showErrors && !clientDemandId && !demands.errorMessage
            ? 'Выберите ожидаемое решение.'
            : ''
        }
        htmlFor="client-demand"
        label="Какого решения вы ожидаете?"
      >
        {demands.errorMessage ? (
          <DictionaryError message={demands.errorMessage} onRetry={demands.retry} />
        ) : (
          <Select
            id="client-demand"
            value={clientDemandId}
            disabled={demands.isLoading}
            aria-invalid={showErrors && !clientDemandId}
            aria-describedby={showErrors && !clientDemandId ? 'client-demand-error' : undefined}
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
          </Select>
        )}
      </FormField>
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
  </FormStep>
);
