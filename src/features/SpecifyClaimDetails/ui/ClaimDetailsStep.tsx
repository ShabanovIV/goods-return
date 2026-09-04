import { FormField } from 'src/shared/ui/FormField';
import { FormStep } from 'src/shared/ui/FormStep';
import { Select } from 'src/shared/ui/Select';
import { ClaimDescriptionField } from './ClaimDescriptionField';
import styles from './ClaimDetailsStep.module.scss';
import { ClaimOptions } from './ClaimOptions';
import { DictionaryError } from './DictionaryError';
import { FlawSelector } from './FlawSelector';
import type { ClaimDetailsStepProps } from '../types/claimDetails';

export const ClaimDetailsStep = ({
  reasonId,
  clientDemandId,
  flawId,
  description,
  isLeftAddress,
  isOpenClient,
  onLeftAddressChange,
  onOpenClientChange,
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
    description="Заполните все поля обращения."
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
      <ClaimOptions
        isLeftAddress={isLeftAddress}
        isOpenClient={isOpenClient}
        onLeftAddressChange={onLeftAddressChange}
        onOpenClientChange={onOpenClientChange}
      />
      <ClaimDescriptionField
        description={description}
        onChange={onDescriptionChange}
        showErrors={showErrors}
      />
    </div>
  </FormStep>
);
