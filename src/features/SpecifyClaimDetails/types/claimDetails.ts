import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import { type ErrorNotice } from 'src/shared/ui/ErrorMessage';

type DictionaryState<T> = {
  items: T[];
  isLoading: boolean;
  errorMessage?: ErrorNotice | string;
  retry: () => void;
};

export type ClaimOptionsProps = {
  showErrors: boolean;
  isLeftAddress: boolean | null;
  isOpenClient: boolean | null;
  onLeftAddressChange: (checked: boolean | null) => void;
  onOpenClientChange: (checked: boolean | null) => void;
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
