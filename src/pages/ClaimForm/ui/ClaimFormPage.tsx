import { useParams } from 'react-router-dom';
import { Alert } from 'src/shared/ui/Alert';
import { IconButton } from 'src/shared/ui/IconButton';
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
  const returnToDocument = () => {
    window.location.assign(`${__API_URL__}?documentId=${encodeURIComponent(documentId)}`);
  };
  const state = useClaimFormState();
  const data = useClaimData(documentId, state.formState);
  const draft = useClaimDraft({
    claimNumber: state.claimNumber,
    documentId,
    formState: state.formState,
    isDocumentLoaded: data.documentQuery.data?.success === true,
    setFormState: state.setFormState,
  });
  const navigation = useClaimFormNavigation({
    data,
    documentId,
    state,
  });

  useClaimFormConsistency({
    flaws: data.flaws,
    flawsLoaded: data.flawsQuery.isSuccess,
    setFormState: state.setFormState,
    setPageError: state.setPageError,
  });

  if (!documentId) return <MissingDocument />;
  if (data.documentQuery.isError) {
    return (
      <DocumentError
        message={getRequestErrorMessage(data.documentQuery.error)}
        onRetry={data.documentQuery.refetch}
      />
    );
  }
  if (data.documentQuery.isLoading) return <LoadingDocument />;
  if (!data.documentQuery.data?.success) {
    return (
      <DocumentError
        message={getRequestErrorMessage(data.documentQuery.error)}
        onRetry={data.documentQuery.refetch}
      />
    );
  }
  if (!draft.isHydrated) return <LoadingDocument />;
  if (state.claimNumber) {
    return (
      <ClaimResult
        claimNumber={state.claimNumber}
        draftCleanupStatus={navigation.draftCleanupStatus}
        onRetryDraftCleanup={navigation.retryDraftCleanup}
        onReturnToDocument={returnToDocument}
      />
    );
  }

  return (
    <div className={s.page}>
      <ClaimFormHeader draftMessage={draft.draftMessage} step={state.formState.step} />
      <main className={s.main}>
        {state.pageError && (
          <Alert
            className={s.pageAlert}
            tone="warning"
            action={
              <IconButton aria-label="Закрыть сообщение" onClick={() => state.setPageError('')}>
                ×
              </IconButton>
            }
          >
            {state.pageError}
          </Alert>
        )}
        <ClaimFormStep data={data} state={state} />
      </main>
      <ClaimFormFooter
        isCreatingClaim={navigation.isCreatingClaim}
        onBack={state.formState.step === 0 ? returnToDocument : navigation.goBack}
        onNext={navigation.goNext}
        step={state.formState.step}
      />
    </div>
  );
};

export default ClaimFormPage;
