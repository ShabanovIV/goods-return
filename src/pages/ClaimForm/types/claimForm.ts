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
  version: 7;
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
