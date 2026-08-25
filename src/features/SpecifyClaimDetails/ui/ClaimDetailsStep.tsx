import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import { FormField } from 'src/shared/ui/FormField';
import { FormStep } from 'src/shared/ui/FormStep';
import { Select } from 'src/shared/ui/Select';
import { ClaimDescriptionField } from './ClaimDescriptionField';
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
  flawId: string;
  description: string;
  reasons: DictionaryState<ClaimDictionaryItem>;
  demands: DictionaryState<ClaimDictionaryItem>;
  flaws: DictionaryState<ClaimFlaw>;
  flawsEnabled: boolean;
  showErrors: boolean;
  onReasonChange: (reasonId: string) => void;
  onDemandChange: (demandId: string) => void;
  onFlawChange: (flawId: string) => void;
  onDescriptionChange: (description: string) => void;
};

export const ClaimDetailsStep = ({
  reasonId,
  clientDemandId,
  flawId,
  description,
  reasons,
  demands,
  flaws,
  flawsEnabled,
  showErrors,
  onReasonChange,
  onDemandChange,
  onFlawChange,
  onDescriptionChange,
}: ClaimDetailsStepProps) => (
  <FormStep
    description="Ответы помогут быстрее передать обращение нужному специалисту."
    step={2}
    title="Обращение"
    titleId="claim-title"
  >
    <div className={styles.formFields}>
      <FormField
        error={
          showErrors && !reasonId && !reasons.errorMessage ? 'Выберите причину обращения.' : ''
        }
        htmlFor="claim-reason"
        label="Причина"
      >
        {reasons.errorMessage ? (
          <DictionaryError message={reasons.errorMessage} onRetry={reasons.retry} />
        ) : (
          <Select
            id="claim-reason"
            value={reasonId}
            disabled={reasons.isLoading}
            options={reasons.items.map((reason) => ({ label: reason.name, value: reason.id }))}
            placeholder={reasons.isLoading ? 'Загружаем причины…' : 'Выберите причину'}
            aria-invalid={showErrors && !reasonId}
            aria-describedby={showErrors && !reasonId ? 'claim-reason-error' : undefined}
            onChange={onReasonChange}
          />
        )}
      </FormField>
      <FlawSelector
        enabled={flawsEnabled}
        errorMessage={flaws.errorMessage}
        flawId={flawId}
        flaws={flaws.items}
        isLoading={flaws.isLoading}
        onChange={onFlawChange}
        onRetry={flaws.retry}
        showErrors={showErrors}
      />
      <FormField
        error={
          showErrors && !clientDemandId && !demands.errorMessage
            ? 'Выберите ожидаемое решение.'
            : ''
        }
        htmlFor="client-demand"
        label="Требование клиента"
      >
        {demands.errorMessage ? (
          <DictionaryError message={demands.errorMessage} onRetry={demands.retry} />
        ) : (
          <Select
            id="client-demand"
            value={clientDemandId}
            disabled={demands.isLoading}
            options={demands.items.map((demand) => ({ label: demand.name, value: demand.id }))}
            placeholder={demands.isLoading ? 'Загружаем варианты…' : 'Выберите вариант'}
            aria-invalid={showErrors && !clientDemandId}
            aria-describedby={showErrors && !clientDemandId ? 'client-demand-error' : undefined}
            onChange={onDemandChange}
          />
        )}
      </FormField>
      <ClaimDescriptionField
        description={description}
        onChange={onDescriptionChange}
        showErrors={showErrors}
      />
    </div>
  </FormStep>
);
