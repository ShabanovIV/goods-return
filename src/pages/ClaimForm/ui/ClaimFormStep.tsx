import { AttachmentsStep } from './AttachmentsStep';
import { ClaimDetailsContainer } from './ClaimDetailsContainer';
import { ProductStep } from './ProductStep';
import { ReviewStep } from './ReviewStep';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import { useClaimData } from '../model/useClaimData';
import { useClaimFormState } from '../model/useClaimFormState';

type ClaimFormStepProps = {
  data: ReturnType<typeof useClaimData>;
  state: ReturnType<typeof useClaimFormState>;
};

export const ClaimFormStep = ({ data, state }: ClaimFormStepProps) => {
  const { formState } = state;

  if (formState.step === 0) {
    return (
      <ProductStep
        products={data.products}
        selectedLines={formState.selectedLines}
        showErrors={state.showErrors}
        onToggle={(product) =>
          state.setFormState((current) => {
            const selectedLines = { ...current.selectedLines };
            if (selectedLines[product.lineId] !== undefined) delete selectedLines[product.lineId];
            else selectedLines[product.lineId] = 1;
            return { ...current, selectedLines, flawIds: [] };
          })
        }
        onAmountChange={(product, amount) =>
          state.setFormState((current) => ({
            ...current,
            selectedLines: { ...current.selectedLines, [product.lineId]: amount },
          }))
        }
      />
    );
  }

  if (formState.step === 1) return <ClaimDetailsContainer data={data} state={state} />;

  if (formState.step === 2) {
    const attachmentType = data.attachmentTypes.find(
      (type) => String(type.order) === state.selectedAttachmentType,
    );
    return (
      <AttachmentsStep
        attachments={formState.attachments}
        attachmentTypes={data.attachmentTypes}
        selectedType={state.selectedAttachmentType}
        isTypesLoading={data.attachmentTypesQuery.isLoading}
        typesError={
          data.attachmentTypesQuery.error
            ? getRequestErrorMessage(data.attachmentTypesQuery.error)
            : undefined
        }
        showErrors={state.showErrors}
        onTypeChange={state.setSelectedAttachmentType}
        onFilesSelected={(files) => state.addFiles(files, attachmentType)}
        onRetryTypes={data.attachmentTypesQuery.refetch}
        onRemoveAttachment={state.removeFile}
      />
    );
  }

  const selectedReason = data.reasons.find((reason) => reason.id === formState.reasonId);
  const selectedDemand = data.demands.find((demand) => demand.id === formState.clientDemandId);
  const selectedFlaws = data.flaws.filter((flaw) => formState.flawIds.includes(flaw.id));

  return (
    <ReviewStep
      products={data.products}
      selectedLines={formState.selectedLines}
      reason={selectedReason}
      demand={selectedDemand}
      flaws={selectedFlaws}
      attachments={formState.attachments}
      onEdit={state.setStep}
    />
  );
};
