import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { convertHeic } from 'src/features/ManageClaimAttachments';
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
    void convertHeic(file, controller.signal).then(
      (jpeg) => {
        if (controller.signal.aborted) return;
        setFormState((current) => ({
          ...current,
          attachments: current.attachments.map((item) =>
            item.localId === localId
              ? {
                  ...item,
                  file: jpeg,
                  fileName: jpeg.name,
                  size: jpeg.size,
                  mimeType: jpeg.type,
                  status: 'selected',
                }
              : item,
          ),
        }));
      },
      () => {
        if (controller.signal.aborted) return;
        setFormState((current) => ({
          ...current,
          attachments: current.attachments.map((item) =>
            item.localId === localId ? { ...item, status: 'error' } : item,
          ),
        }));
      },
    );
    return () => controller.abort();
  }, [localId, file, setFormState]);
};
