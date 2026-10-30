import { useCallback, useEffect, useState } from 'react';
import { removeAttachment } from 'src/features/ManageClaimAttachments';
import { type ErrorNotice } from 'src/shared/ui/ErrorMessage';
import { createEmptyClaimForm } from './claimFormState';
import { useAttachmentConversion } from './useAttachmentConversion';
import { useAttachmentSelection } from './useAttachmentSelection';
import type { ClaimStep } from '../types/claimForm';

export const useClaimFormState = () => {
  const [formState, setFormState] = useState(createEmptyClaimForm);
  useAttachmentConversion(formState, setFormState);
  const [showErrors, setShowErrors] = useState(false);
  const [pageError, setPageErrorValue] = useState<ErrorNotice | string>('');
  const [pageErrorRevision, setPageErrorRevision] = useState(0);
  const [claimNumber, setClaimNumber] = useState('');

  const setPageError = useCallback((message: ErrorNotice | string) => {
    setPageErrorValue(message);
    if (message) setPageErrorRevision((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!pageErrorRevision) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageErrorRevision]);

  const setStep = (step: ClaimStep) => {
    setFormState((current) => ({ ...current, step }));
    setShowErrors(false);
    setPageError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addFiles = useAttachmentSelection(formState, setFormState, setPageError);

  const removeFile = (localId: string) => {
    setFormState((current) => ({
      ...current,
      attachments: removeAttachment(current.attachments, localId),
    }));
  };

  const resetForm = () => {
    setFormState(createEmptyClaimForm());
    setClaimNumber('');
  };

  return {
    addFiles,
    claimNumber,
    formState,
    pageError,
    removeFile,
    resetForm,
    setClaimNumber,
    setFormState,
    setPageError,
    setShowErrors,
    setStep,
    showErrors,
  };
};
