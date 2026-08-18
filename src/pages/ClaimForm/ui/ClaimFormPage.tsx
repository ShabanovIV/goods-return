import { useParams } from 'react-router-dom';
import { DocumentError, LoadingDocument, MissingDocument } from './ClaimDocumentState';
import { ClaimFormFooter } from './ClaimFormFooter';
import { ClaimFormHeader } from './ClaimFormHeader';
import s from './ClaimFormPage.module.scss';
import { ClaimFormStep } from './ClaimFormStep';
import { ClaimResult } from './ClaimResult';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import { useClaimData } from '../model/useClaimData';
import { useClaimDraft } from '../model/useClaimDraft';
import { useClaimFormConsistency } from '../model/useClaimFormConsistency';
import { useClaimFormNavigation } from '../model/useClaimFormNavigation';
import { useClaimFormState } from '../model/useClaimFormState';

const ClaimFormPage = () => {
  const { documentId = '' } = useParams<{ documentId: string }>();
  const state = useClaimFormState();
  const data = useClaimData(documentId, state.formState);
  const draft = useClaimDraft({
    claimNumber: state.claimNumber,
    documentId,
    formState: state.formState,
    setFormState: state.setFormState,
  });
  const navigation = useClaimFormNavigation({
    data,
    documentId,
    setDraftMessage: draft.setDraftMessage,
    state,
  });

  useClaimFormConsistency({
    attachmentTypes: data.attachmentTypes,
    flaws: data.flaws,
    flawsLoaded: data.flawsQuery.isSuccess,
    selectedAttachmentType: state.selectedAttachmentType,
    setFormState: state.setFormState,
    setPageError: state.setPageError,
    setSelectedAttachmentType: state.setSelectedAttachmentType,
  });

  if (!documentId) return <MissingDocument />;
  if (data.documentQuery.isLoading || !draft.isHydrated) {
    return <LoadingDocument />;
  }
  if (data.documentQuery.isError || !data.documentQuery.data?.success) {
    return (
      <DocumentError
        message={getRequestErrorMessage(data.documentQuery.error)}
        onRetry={data.documentQuery.refetch}
      />
    );
  }
  if (state.claimNumber) {
    return (
      <ClaimResult
        claimNumber={state.claimNumber}
        onStartAgain={() => {
          state.resetForm();
          draft.setDraftMessage('Черновик сохраняется автоматически');
        }}
      />
    );
  }

  return (
    <div className={s.page}>
      <ClaimFormHeader draftMessage={draft.draftMessage} step={state.formState.step} />
      <main className={s.main}>
        {state.pageError && (
          <div className={s.pageAlert} role="alert">
            <span>{state.pageError}</span>
            <button
              type="button"
              aria-label="Закрыть сообщение"
              onClick={() => state.setPageError('')}
            >
              ×
            </button>
          </div>
        )}
        <ClaimFormStep data={data} state={state} />
      </main>
      <ClaimFormFooter
        isCreatingClaim={navigation.isCreatingClaim}
        isUploadingAttachments={navigation.isUploadingAttachments}
        onBack={navigation.goBack}
        onNext={navigation.goNext}
        step={state.formState.step}
      />
    </div>
  );
};

export default ClaimFormPage;
