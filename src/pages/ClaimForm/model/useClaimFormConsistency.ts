import { Dispatch, SetStateAction, useEffect } from 'react';
import type { ClaimFlaw } from 'src/entities/Claim';
import type { ClaimFormState } from './claimFormTypes';

type UseClaimFormConsistencyArguments = {
  flaws: ClaimFlaw[];
  flawsLoaded: boolean;
  setFormState: Dispatch<SetStateAction<ClaimFormState>>;
  setPageError: Dispatch<SetStateAction<string>>;
};

export const useClaimFormConsistency = ({
  flaws,
  flawsLoaded,
  setFormState,
  setPageError,
}: UseClaimFormConsistencyArguments) => {
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
