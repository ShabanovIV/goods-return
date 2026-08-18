import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  fromPersistedClaimDraft,
  getDraftKey,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import type { ClaimFormState } from '../types/claimForm';

const configuration = configHelperFactory();

type UseClaimDraftArguments = {
  claimNumber: string;
  documentId: string;
  formState: ClaimFormState;
  setFormState: Dispatch<SetStateAction<ClaimFormState>>;
};

export const useClaimDraft = ({
  claimNumber,
  documentId,
  formState,
  setFormState,
}: UseClaimDraftArguments) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [draftMessage, setDraftMessage] = useState('Восстанавливаем черновик…');

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
    const timeoutId = window.setTimeout(() => {
      configuration
        .setConfiguration(getDraftKey(documentId), toPersistedClaimDraft(formState))
        .then(() => setDraftMessage('Черновик сохранён'))
        .catch(() => setDraftMessage('Не удалось сохранить черновик'));
    }, 350);
    return () => window.clearTimeout(timeoutId);
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
