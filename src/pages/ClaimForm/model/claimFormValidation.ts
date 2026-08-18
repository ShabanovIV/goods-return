import type { AttachmentType, ClaimFlaw } from 'src/entities/Claim';
import type { DocumentDetail } from 'src/entities/Document';
import type { ClaimFormState, ClaimStep } from './claimFormTypes';

type ClaimValidationContext = {
  areAttachmentTypesReady: boolean;
  areDetailsReady: boolean;
  attachmentTypes: AttachmentType[];
  flaws: ClaimFlaw[];
  formState: ClaimFormState;
  products: DocumentDetail[];
  selectedLineIds: string[];
};

export const isClaimStepValid = (step: ClaimStep, context: ClaimValidationContext) => {
  const {
    areAttachmentTypesReady,
    areDetailsReady,
    attachmentTypes,
    flaws,
    formState,
    products,
    selectedLineIds,
  } = context;

  if (step === 0) {
    return (
      selectedLineIds.length > 0 &&
      selectedLineIds.every((lineId) => {
        const product = products.find((item) => item.lineId === lineId);
        const amount = formState.selectedLines[lineId];
        return Boolean(
          product &&
          Number.isInteger(amount) &&
          amount >= 1 &&
          amount <= Math.floor(product.amount),
        );
      })
    );
  }

  if (step === 1) {
    return Boolean(
      formState.reasonId &&
      formState.clientDemandId &&
      areDetailsReady &&
      (flaws.length === 0 || formState.flawIds.length > 0),
    );
  }

  if (step === 2) {
    const requirementsMet = attachmentTypes.every(
      (type) =>
        formState.attachments.filter((item) => item.attachmentTypeOrder === type.order).length >=
        type.minAmount,
    );
    return Boolean(areAttachmentTypesReady && requirementsMet);
  }

  return true;
};
