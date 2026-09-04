import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';

type DictionaryState<T> = {
  items: T[];
  isLoading: boolean;
  errorMessage?: string;
  retry: () => void;
};

export type ClaimOptionsProps = {
  isLeftAddress: boolean;
  isOpenClient: boolean;
  onLeftAddressChange: (checked: boolean) => void;
  onOpenClientChange: (checked: boolean) => void;
};

export type ClaimDetailsStepProps = ClaimOptionsProps & {
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  description: string;
  reasons: DictionaryState<ClaimDictionaryItem>;
  demands: DictionaryState<ClaimDictionaryItem>;
  flaws: DictionaryState<ClaimFlaw>;
  flawsEnabled: boolean;
  showErrors: boolean;
  onReasonChange: (reasonId: string) => void;
  onDemandChange: (demandId: string) => void;
  onFlawChange: (flawId: string) => void;
  onDescriptionChange: (description: string) => void;
};
