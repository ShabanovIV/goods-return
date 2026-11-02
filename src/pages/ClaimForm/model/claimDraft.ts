import { isDraftData } from './claimDraftValidation';
import type { ClaimFormState, PersistedClaimDraft } from '../types/claimForm';

const CLAIM_DRAFT_PREFIX = 'goods-return:claim-draft:';
const CLAIM_DRAFT_VERSION = 7;

export const toPersistedClaimDraft = (state: ClaimFormState): PersistedClaimDraft => ({
  version: CLAIM_DRAFT_VERSION,
  savedAt: new Date().toISOString(),
  step: state.step,
  selectedLines: state.selectedLines,
  reasonId: state.reasonId,
  clientDemandId: state.clientDemandId,
  flawId: state.flawId,
  description: state.description,
  isLeftAddress: state.isLeftAddress,
  isOpenClient: state.isOpenClient,
  attachments: state.attachments
    .filter((attachment) => attachment.status !== 'uploaded')
    .map((attachment) =>
      attachment.status === 'processing'
        ? { ...attachment, file: undefined, status: 'error', errorReason: 'interrupted' }
        : attachment.status === 'error'
          ? { ...attachment, file: undefined }
          : attachment,
    ),
});

export const isPersistedClaimDraft = (value: unknown): value is PersistedClaimDraft =>
  isDraftData(value, CLAIM_DRAFT_VERSION) &&
  typeof value.description === 'string' &&
  (value.isLeftAddress === null || typeof value.isLeftAddress === 'boolean') &&
  (value.isOpenClient === null || typeof value.isOpenClient === 'boolean');

export const fromPersistedClaimDraft = (draft: PersistedClaimDraft): ClaimFormState => ({
  step: draft.step,
  selectedLines: draft.selectedLines,
  reasonId: draft.reasonId,
  clientDemandId: draft.clientDemandId,
  flawId: draft.flawId,
  description: draft.description,
  isLeftAddress: draft.isLeftAddress,
  isOpenClient: draft.isOpenClient,
  attachments: draft.attachments,
});

const getVersionedDraftKey = (documentId: string, version: number) =>
  `${CLAIM_DRAFT_PREFIX}v${version}:${documentId}`;

export const getDraftKey = (documentId: string) =>
  getVersionedDraftKey(documentId, CLAIM_DRAFT_VERSION);

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
