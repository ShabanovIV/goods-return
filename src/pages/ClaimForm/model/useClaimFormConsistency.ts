import { Dispatch, SetStateAction, useEffect } from 'react';
import type { ClaimFlaw } from 'src/entities/Claim';
import type { ClaimFormState } from '../types/claimForm';

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
    setFormState((current) => {
      if (!current.flawId || flaws.some((flaw) => flaw.id === current.flawId)) return current;
      setPageError('Список недостатков изменился. Выберите недостаток заново.');
      return { ...current, flawId: '' };
    });
  }, [flaws, flawsLoaded, setFormState, setPageError]);
};
