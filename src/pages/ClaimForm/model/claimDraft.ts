import type { ClaimFormState, PersistedClaimDraft } from '../types/claimForm';

export const toPersistedClaimDraft = (state: ClaimFormState): PersistedClaimDraft => ({
  version: 2,
  savedAt: new Date().toISOString(),
  step: state.step,
  selectedLines: state.selectedLines,
  reasonId: state.reasonId,
  clientDemandId: state.clientDemandId,
  flawId: state.flawId,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSelectedLines = (value: unknown): value is Record<string, number> =>
  isRecord(value) &&
  Object.values(value).every(
    (amount) => typeof amount === 'number' && Number.isInteger(amount) && amount > 0,
  );

export const isPersistedClaimDraft = (value: unknown): value is PersistedClaimDraft => {
  if (!isRecord(value)) return false;

  return (
    value.version === 2 &&
    typeof value.savedAt === 'string' &&
    Number.isInteger(value.step) &&
    typeof value.step === 'number' &&
    value.step >= 0 &&
    value.step <= 3 &&
    isSelectedLines(value.selectedLines) &&
    typeof value.reasonId === 'string' &&
    typeof value.clientDemandId === 'string' &&
    typeof value.flawId === 'string'
  );
};

export const fromPersistedClaimDraft = (draft: PersistedClaimDraft): ClaimFormState => ({
  step: draft.step,
  selectedLines: draft.selectedLines,
  reasonId: draft.reasonId,
  clientDemandId: draft.clientDemandId,
  flawId: draft.flawId,
  attachments: [],
});

export const getDraftKey = (documentId: string) => `goods-return:claim-draft:v2:${documentId}`;
