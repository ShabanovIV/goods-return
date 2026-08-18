import type { ClaimAttachment } from 'src/entities/Claim';

export const CLAIM_STEPS = ['Товары', 'Обращение', 'Вложения', 'Проверка'] as const;

export type ClaimStep = 0 | 1 | 2 | 3;

export type ClaimFormState = {
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  attachments: ClaimAttachment[];
};

export type PersistedClaimDraft = {
  version: 1;
  savedAt: string;
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
};

export const createEmptyClaimForm = (): ClaimFormState => ({
  step: 0,
  selectedLines: {},
  reasonId: '',
  clientDemandId: '',
  flawIds: [],
  attachments: [],
});
