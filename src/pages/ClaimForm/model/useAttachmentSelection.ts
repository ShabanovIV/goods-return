import { useEffect, useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { AttachmentType } from 'src/entities/Claim';
import {
  addSelectedFiles,
  isHeicFile,
  readAttachmentFile,
} from 'src/features/ManageClaimAttachments';
import type { ClaimFormState } from '../types/claimForm';

export const useAttachmentSelection = (
  formState: ClaimFormState,
  setFormState: Dispatch<SetStateAction<ClaimFormState>>,
  setError: (message: string) => void,
) => {
  const attachments = useRef(formState.attachments);
  const reads = useRef(new Map<string, AbortController>());

  useLayoutEffect(() => {
    attachments.current = formState.attachments;
    const ids = new Set(formState.attachments.map((item) => item.localId));
    for (const [id, controller] of reads.current) {
      if (!ids.has(id)) {
        controller.abort();
        reads.current.delete(id);
      }
    }
  }, [formState.attachments]);

  useEffect(() => {
    const pending = reads.current;
    return () => {
      pending.forEach((controller) => controller.abort());
      pending.clear();
    };
  }, []);

  return (files: readonly File[], attachmentType?: AttachmentType) => {
    const errors = new Set<string>();
    // Start the entire batch before inspecting metadata of any selected file.
    const pending = files.map((file) => {
      const controller = new AbortController();
      const reading = readAttachmentFile(file, controller.signal);
      return { file, controller, reading };
    });
    for (const { file, controller, reading } of pending) {
      const result = addSelectedFiles({
        attachments: attachments.current,
        files: [file],
        attachmentType,
      });
      if (result.error) errors.add(result.error);
      if (result.attachments.length === attachments.current.length) {
        controller.abort();
        void reading.catch(() => {});
        continue;
      }
      const added = { ...result.attachments[result.attachments.length - 1], file: undefined };
      // Reserve space synchronously, including selections made before React commits the state.
      attachments.current = [...attachments.current, added];
      reads.current.set(added.localId, controller);
      setFormState((current) => ({ ...current, attachments: [...current.attachments, added] }));

      void reading
        .then(
          (copy) => {
            if (controller.signal.aborted) return;
            setFormState((current) => ({
              ...current,
              attachments: current.attachments.map((item) =>
                item.localId === added.localId
                  ? {
                      ...item,
                      file: copy,
                      size: copy.size,
                      lastModified: copy.lastModified,
                      status: isHeicFile(copy) ? 'processing' : 'selected',
                    }
                  : item,
              ),
            }));
          },
          (error: unknown) => {
            if (controller.signal.aborted) return;
            setFormState((current) => ({
              ...current,
              attachments: current.attachments.map((item) =>
                item.localId === added.localId
                  ? {
                      ...item,
                      status: 'error',
                      errorReason: 'read',
                      errorDetails:
                        error instanceof Error ? `${error.name}: ${error.message}` : String(error),
                    }
                  : item,
              ),
            }));
          },
        )
        .finally(() => reads.current.delete(added.localId));
    }
    if (errors.size) setError([...errors].join(' '));
  };
};
