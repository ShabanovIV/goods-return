import { useCallback, useEffect, useState } from 'react';
import type { AttachmentType } from 'src/entities/Claim';
import { addSelectedFiles, removeAttachment } from 'src/features/ManageClaimAttachments';
import { createEmptyClaimForm } from './claimFormState';
import type { ClaimStep } from '../types/claimForm';

export const useClaimFormState = () => {
  const [formState, setFormState] = useState(createEmptyClaimForm);
  const [showErrors, setShowErrors] = useState(false);
  const [pageError, setPageErrorValue] = useState('');
  const [pageErrorRevision, setPageErrorRevision] = useState(0);
  const [claimNumber, setClaimNumber] = useState('');

  const setPageError = useCallback((message: string) => {
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

  const addFiles = (files: readonly File[], attachmentType?: AttachmentType) => {
    setFormState((current) => {
      const result = addSelectedFiles({ attachments: current.attachments, files, attachmentType });
      if (result.error) setPageError(result.error);
      return { ...current, attachments: result.attachments };
    });
  };

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
