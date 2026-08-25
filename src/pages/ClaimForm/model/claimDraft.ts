import { isDraftData } from './claimDraftValidation';
import type {
  ClaimFormState,
  PersistedClaimDraft,
  PreviousPersistedClaimDraft,
} from '../types/claimForm';

const CLAIM_DRAFT_PREFIX = 'goods-return:claim-draft:';
const CLAIM_DRAFT_VERSION = 4;
const PREVIOUS_DRAFT_VERSION = 3;

export const toPersistedClaimDraft = (state: ClaimFormState): PersistedClaimDraft => ({
  version: CLAIM_DRAFT_VERSION,
  savedAt: new Date().toISOString(),
  step: state.step,
  selectedLines: state.selectedLines,
  reasonId: state.reasonId,
  clientDemandId: state.clientDemandId,
  flawId: state.flawId,
  description: state.description,
  attachments: state.attachments.filter(
    (attachment) => attachment.status === 'selected' && attachment.file instanceof File,
  ),
});

export const isPersistedClaimDraft = (value: unknown): value is PersistedClaimDraft =>
  isDraftData(value, CLAIM_DRAFT_VERSION) && typeof value.description === 'string';

export const isPreviousPersistedClaimDraft = (
  value: unknown,
): value is PreviousPersistedClaimDraft => isDraftData(value, PREVIOUS_DRAFT_VERSION);

export const fromPersistedClaimDraft = (
  draft: PersistedClaimDraft | PreviousPersistedClaimDraft,
): ClaimFormState => ({
  step: draft.step,
  selectedLines: draft.selectedLines,
  reasonId: draft.reasonId,
  clientDemandId: draft.clientDemandId,
  flawId: draft.flawId,
  description: 'description' in draft ? draft.description : '',
  attachments: draft.attachments,
});

const getVersionedDraftKey = (documentId: string, version: number) =>
  `${CLAIM_DRAFT_PREFIX}v${version}:${documentId}`;

export const getDraftKey = (documentId: string) =>
  getVersionedDraftKey(documentId, CLAIM_DRAFT_VERSION);

export const getPreviousDraftKey = (documentId: string) =>
  getVersionedDraftKey(documentId, PREVIOUS_DRAFT_VERSION);

export const getOutdatedDraftKeys = (keys: string[], documentId: string) => {
  return keys.filter((key) => {
    if (!key.startsWith(CLAIM_DRAFT_PREFIX)) return false;
    const keyTail = key.slice(CLAIM_DRAFT_PREFIX.length);
    const separatorIndex = keyTail.indexOf(':');
    if (separatorIndex < 0 || keyTail.slice(separatorIndex + 1) !== documentId) return false;
    const versionPart = keyTail.slice(0, separatorIndex);
    const version = versionPart.startsWith('v') ? Number(versionPart.slice(1)) : Number.NaN;
    return Number.isInteger(version) && version < CLAIM_DRAFT_VERSION;
  });
};
