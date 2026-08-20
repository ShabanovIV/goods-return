import type { ClaimAttachment } from 'src/entities/Claim';

export type ClaimStep = 0 | 1 | 2 | 3;

export type ClaimFormState = {
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  attachments: ClaimAttachment[];
};

export type PersistedClaimDraft = {
  version: 3;
  savedAt: string;
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  attachments: ClaimAttachment[];
};
