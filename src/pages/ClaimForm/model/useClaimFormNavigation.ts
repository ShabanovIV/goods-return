import { useSubmitClaim } from 'src/features/SubmitClaim';
import { isClaimStepValid } from './claimFormValidation';
import { useClaimData } from './useClaimData';
import { removeClaimDraft } from './useClaimDraft';
import { useClaimFormState } from './useClaimFormState';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import type { ClaimStep } from '../types/claimForm';

type UseClaimFormNavigationArguments = {
  data: ReturnType<typeof useClaimData>;
  documentId: string;
  setDraftMessage: (message: string) => void;
  state: ReturnType<typeof useClaimFormState>;
};

export const useClaimFormNavigation = ({
  data,
  documentId,
  setDraftMessage,
  state,
}: UseClaimFormNavigationArguments) => {
  const submission = useSubmitClaim();
  const validationContext = {
    areAttachmentTypesReady: data.areAttachmentTypesReady,
    areDetailsReady: data.areDetailsReady,
    attachmentTypes: data.attachmentTypes,
    flaws: data.flaws,
    formState: state.formState,
    products: data.products,
    selectedLineIds: data.selectedLineIds,
  };
  const showInvalidStep = (step: ClaimStep, message: string) => {
    state.setFormState((current) => ({ ...current, step }));
    state.setShowErrors(true);
    state.setPageError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    const invalidStep = ([0, 1, 2] as ClaimStep[]).find(
      (step) => !isClaimStepValid(step, validationContext),
    );
    if (invalidStep !== undefined) {
      showInvalidStep(invalidStep, 'Проверьте заполнение обращения перед отправкой.');
      return;
    }

    try {
      state.setPageError('');
      const claimNumber = await submission.submitClaim({
        documentId,
        selectedLines: state.formState.selectedLines,
        reasonId: state.formState.reasonId,
        clientDemandId: state.formState.clientDemandId,
        flawId: state.formState.flawId,
        description: state.formState.description,
        isLeftAddress: state.formState.isLeftAddress,
        isOpenClient: state.formState.isOpenClient,
        attachments: state.formState.attachments,
      });
      state.setClaimNumber(claimNumber);
      void removeClaimDraft(documentId).catch(() =>
        setDraftMessage('Претензия отправлена, но черновик удалить не удалось'),
      );
    } catch (error: unknown) {
      state.setPageError(getRequestErrorMessage(error));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = () => {
    if (state.formState.step === 3) {
      void submit();
      return;
    }
    if (!isClaimStepValid(state.formState.step, validationContext)) {
      showInvalidStep(state.formState.step, 'Проверьте заполнение этого шага перед продолжением.');
      return;
    }
    state.setStep((state.formState.step + 1) as ClaimStep);
  };

  return {
    goBack: () => state.setStep((state.formState.step - 1) as ClaimStep),
    goNext,
    isCreatingClaim: submission.isCreatingClaim,
  };
};
