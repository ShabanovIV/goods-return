import { Dispatch, SetStateAction, useEffect } from 'react';
import type { AttachmentType, ClaimFlaw } from 'src/entities/Claim';
import type { ClaimFormState } from '../types/claimForm';

type UseClaimFormConsistencyArguments = {
  attachmentTypes: AttachmentType[];
  attachmentTypesLoaded: boolean;
  flaws: ClaimFlaw[];
  flawsLoaded: boolean;
  setFormState: Dispatch<SetStateAction<ClaimFormState>>;
  setPageError: (message: string) => void;
};

export const useClaimFormConsistency = ({
  attachmentTypes,
  attachmentTypesLoaded,
  flaws,
  flawsLoaded,
  setFormState,
  setPageError,
}: UseClaimFormConsistencyArguments) => {
  useEffect(() => {
    if (!attachmentTypesLoaded) return;
    setFormState((current) => {
      const attachments = current.attachments.filter((attachment) =>
        attachmentTypes.some((type) => type.order === attachment.attachmentTypeOrder),
      );
      return attachments.length === current.attachments.length
        ? current
        : { ...current, attachments };
    });
  }, [attachmentTypes, attachmentTypesLoaded, setFormState]);

  useEffect(() => {
    if (!flawsLoaded) return;
    setFormState((current) => {
      if (!current.flawId || flaws.some((flaw) => flaw.id === current.flawId)) return current;
      setPageError('Список недостатков изменился. Выберите недостаток заново.');
      return { ...current, flawId: '' };
    });
  }, [flaws, flawsLoaded, setFormState, setPageError]);
};
