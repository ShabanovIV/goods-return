import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { prepareAttachmentFile } from 'src/features/ManageClaimAttachments';
import type { ClaimFormState } from '../types/claimForm';

export const useAttachmentConversion = (
  formState: ClaimFormState,
  setFormState: Dispatch<SetStateAction<ClaimFormState>>,
) => {
  const pending = formState.attachments.find((item) => item.status === 'processing');
  const localId = pending?.localId;
  const file = pending?.file;

  useEffect(() => {
    if (!localId || !file) return;
    const controller = new AbortController();
    void prepareAttachmentFile(file, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setFormState((current) => ({
        ...current,
        attachments: current.attachments.map((item) =>
          item.localId === localId
            ? {
                ...item,
                file: result.file,
                fileName: result.file?.name ?? item.fileName,
                size: result.file?.size ?? item.size,
                mimeType: result.file?.type || item.mimeType,
                status: result.file ? 'selected' : 'error',
                errorReason: result.errorReason,
                errorDetails: result.errorDetails,
              }
            : item,
        ),
      }));
    });
    return () => controller.abort();
  }, [localId, file, setFormState]);
};
