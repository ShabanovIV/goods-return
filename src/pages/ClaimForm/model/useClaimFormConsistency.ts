import { Dispatch, SetStateAction, useEffect } from 'react';
import type { AttachmentType, ClaimFlaw } from 'src/entities/Claim';
import type { ClaimFormState } from './claimFormTypes';

type UseClaimFormConsistencyArguments = {
  attachmentTypes: AttachmentType[];
  flaws: ClaimFlaw[];
  flawsLoaded: boolean;
  selectedAttachmentType: string;
  setFormState: Dispatch<SetStateAction<ClaimFormState>>;
  setPageError: Dispatch<SetStateAction<string>>;
  setSelectedAttachmentType: Dispatch<SetStateAction<string>>;
};

export const useClaimFormConsistency = ({
  attachmentTypes,
  flaws,
  flawsLoaded,
  selectedAttachmentType,
  setFormState,
  setPageError,
  setSelectedAttachmentType,
}: UseClaimFormConsistencyArguments) => {
  useEffect(() => {
    if (!attachmentTypes.length || selectedAttachmentType) return;
    setSelectedAttachmentType(String(attachmentTypes[0].order));
  }, [attachmentTypes, selectedAttachmentType, setSelectedAttachmentType]);

  useEffect(() => {
    if (!flawsLoaded) return;
    const availableIds = new Set(flaws.map((flaw) => flaw.id));
    setFormState((current) => {
      const availableSelection = current.flawIds.filter((id) => availableIds.has(id));
      if (availableSelection.length === current.flawIds.length) return current;
      setPageError('Список недостатков изменился. Проверьте выбранные значения.');
      return { ...current, flawIds: availableSelection };
    });
  }, [flaws, flawsLoaded, setFormState, setPageError]);
};
