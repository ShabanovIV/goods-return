import type { ClaimAttachment } from 'src/entities/Claim';

export type ClaimStep = 0 | 1 | 2 | 3;

export type ClaimFormState = {
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  description: string;
  isLeftAddress: boolean | null;
  isOpenClient: boolean | null;
  attachments: ClaimAttachment[];
};

export type PersistedClaimDraft = {
  version: 6;
  savedAt: string;
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  description: string;
  isLeftAddress: boolean | null;
  isOpenClient: boolean | null;
  attachments: ClaimAttachment[];
};

export type PreviousPersistedClaimDraft = Omit<
  PersistedClaimDraft,
  'isLeftAddress' | 'isOpenClient' | 'version'
> &
  ({ version: 4 } | { version: 5; isLeftAddress: boolean; isOpenClient: boolean });

export type LegacyPersistedClaimDraft = Omit<
  PreviousPersistedClaimDraft,
  'description' | 'version'
> & {
  version: 3;
};
