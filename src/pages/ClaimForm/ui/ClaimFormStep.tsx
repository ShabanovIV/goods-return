import { AttachmentsStep } from 'src/features/ManageClaimAttachments';
import { ReviewStep, type ReviewSection } from 'src/features/ReviewClaim';
import { ProductStep } from 'src/features/SelectClaimProducts';
import { ClaimDetailsContainer } from './ClaimDetailsContainer';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import { useClaimData } from '../model/useClaimData';
import { useClaimFormState } from '../model/useClaimFormState';

type ClaimFormStepProps = {
  data: ReturnType<typeof useClaimData>;
  state: ReturnType<typeof useClaimFormState>;
};

const reviewStep: Record<ReviewSection, 0 | 1 | 2> = {
  products: 0,
  details: 1,
  attachments: 2,
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
            return { ...current, selectedLines, flawId: '' };
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
    return (
      <AttachmentsStep
        attachments={formState.attachments}
        attachmentTypes={data.attachmentTypes}
        isTypesLoading={data.attachmentTypesQuery.isLoading}
        typesError={
          data.attachmentTypesQuery.error
            ? getRequestErrorMessage(data.attachmentTypesQuery.error)
            : undefined
        }
        showErrors={state.showErrors}
        onFilesSelected={(attachmentType, files) => state.addFiles(files, attachmentType)}
        onRetryTypes={data.attachmentTypesQuery.refetch}
        onRemoveAttachment={state.removeFile}
      />
    );
  }

  const selectedReason = data.reasons.find((reason) => reason.id === formState.reasonId);
  const selectedDemand = data.demands.find((demand) => demand.id === formState.clientDemandId);
  const selectedFlaw = data.flaws.find((flaw) => flaw.id === formState.flawId);

  return (
    <ReviewStep
      products={data.products}
      selectedLines={formState.selectedLines}
      reason={selectedReason}
      demand={selectedDemand}
      flaw={selectedFlaw}
      attachments={formState.attachments}
      onEdit={(section) => state.setStep(reviewStep[section])}
    />
  );
};
