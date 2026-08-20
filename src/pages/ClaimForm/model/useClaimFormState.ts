import { useState } from 'react';
import type { AttachmentType } from 'src/entities/Claim';
import { addSelectedFiles, removeAttachment } from 'src/features/ManageClaimAttachments';
import { createEmptyClaimForm } from './claimFormState';
import type { ClaimStep } from '../types/claimForm';

export const useClaimFormState = () => {
  const [formState, setFormState] = useState(createEmptyClaimForm);
  const [showErrors, setShowErrors] = useState(false);
  const [pageError, setPageError] = useState('');
  const [claimNumber, setClaimNumber] = useState('');

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

  const markAttachmentsUploaded = () => {
    setFormState((current) => ({
      ...current,
      attachments: current.attachments.map((attachment) =>
        attachment.status === 'selected'
          ? { ...attachment, status: 'uploaded', file: undefined }
          : attachment,
      ),
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
    markAttachmentsUploaded,
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
