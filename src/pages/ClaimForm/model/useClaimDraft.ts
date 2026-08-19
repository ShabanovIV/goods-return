import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  fromPersistedClaimDraft,
  getDraftKey,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimDraft';
import { removeOutdatedClaimDrafts } from './claimDraftCleanup';
import { createEmptyClaimForm } from './claimFormState';
import type { ClaimFormState } from '../types/claimForm';

const configuration = configHelperFactory();

type UseClaimDraftArguments = {
  claimNumber: string;
  documentId: string;
  isDocumentLoaded: boolean;
  formState: ClaimFormState;
  setFormState: Dispatch<SetStateAction<ClaimFormState>>;
};

export const useClaimDraft = ({
  claimNumber,
  documentId,
  isDocumentLoaded,
  formState,
  setFormState,
}: UseClaimDraftArguments) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [draftMessage, setDraftMessage] = useState('Восстанавливаем черновик…');
  const cleanedDocumentIdRef = useRef('');

  useEffect(() => {
    if (!documentId || !isDocumentLoaded || cleanedDocumentIdRef.current === documentId) return;
    cleanedDocumentIdRef.current = documentId;
    removeOutdatedClaimDrafts(documentId).catch(() =>
      setDraftMessage('Не удалось удалить устаревшие черновики'),
    );
  }, [documentId, isDocumentLoaded]);

  useEffect(() => {
    const controller = new AbortController();
    setIsHydrated(false);
    setFormState(createEmptyClaimForm());
    setDraftMessage('Восстанавливаем черновик…');
    if (!documentId) return () => undefined;

    configuration
      .getConfiguration(getDraftKey(documentId), null, isPersistedClaimDraft)
      .then((draft) => {
        if (controller.signal.aborted) return;
        if (draft) {
          setFormState(fromPersistedClaimDraft(draft));
          setDraftMessage('Черновик восстановлен');
        } else setDraftMessage('Черновик сохраняется автоматически');
      })
      .catch(() => {
        if (!controller.signal.aborted) setDraftMessage('Не удалось восстановить черновик');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsHydrated(true);
      });

    return () => controller.abort();
  }, [documentId, setFormState]);

  useEffect(() => {
    if (!isHydrated || !documentId || claimNumber) return undefined;
    configuration
      .setConfiguration(getDraftKey(documentId), toPersistedClaimDraft(formState))
      .then(() => setDraftMessage('Черновик сохранён'))
      .catch(() => setDraftMessage('Не удалось сохранить черновик'));
    return undefined;
  }, [claimNumber, documentId, formState, isHydrated]);

  useEffect(() => {
    if (!isHydrated || claimNumber) return undefined;
    const hasDraft =
      Object.keys(formState.selectedLines).length > 0 ||
      Boolean(formState.reasonId || formState.clientDemandId);
    if (!hasDraft) return undefined;
    const preventAccidentalClose = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', preventAccidentalClose);
    return () => window.removeEventListener('beforeunload', preventAccidentalClose);
  }, [claimNumber, formState, isHydrated]);

  return { draftMessage, isHydrated, setDraftMessage };
};

export const removeClaimDraft = (documentId: string) =>
  configuration.removeConfiguration(getDraftKey(documentId));
