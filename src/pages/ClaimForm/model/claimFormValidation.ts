import type { AttachmentType, ClaimFlaw } from 'src/entities/Claim';
import type { DocumentDetail } from 'src/entities/Document';
import { exceedsAttachmentsLimit } from 'src/shared/lib/attachmentSize';
import type { ClaimFormState, ClaimStep } from '../types/claimForm';

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
      typeof formState.isLeftAddress === 'boolean' &&
      typeof formState.isOpenClient === 'boolean' &&
      formState.reasonId &&
      formState.clientDemandId &&
      formState.description.trim() &&
      formState.description.length <= 1000 &&
      areDetailsReady &&
      (flaws.length === 0 || Boolean(formState.flawId)),
    );
  }

  if (step === 2) {
    const requirementsMet = attachmentTypes.every(
      (type) =>
        formState.attachments.filter((item) => item.attachmentTypeOrder === type.order).length >=
        type.minAmount,
    );
    return Boolean(
      areAttachmentTypesReady &&
      !exceedsAttachmentsLimit(formState.attachments) &&
      requirementsMet &&
      formState.attachments.every(
        (item) => item.status === 'selected' || item.status === 'uploaded',
      ),
    );
  }

  return true;
};
