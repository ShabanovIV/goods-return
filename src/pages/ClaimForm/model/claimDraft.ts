import type { ClaimAttachment } from 'src/entities/Claim';
import type { ClaimFormState, PersistedClaimDraft } from '../types/claimForm';

const CLAIM_DRAFT_PREFIX = 'goods-return:claim-draft:';
const CLAIM_DRAFT_VERSION = 3;

export const toPersistedClaimDraft = (state: ClaimFormState): PersistedClaimDraft => ({
  version: CLAIM_DRAFT_VERSION,
  savedAt: new Date().toISOString(),
  step: state.step,
  selectedLines: state.selectedLines,
  reasonId: state.reasonId,
  clientDemandId: state.clientDemandId,
  flawId: state.flawId,
  attachments: state.attachments.filter(
    (attachment) => attachment.status === 'selected' && attachment.file instanceof File,
  ),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSelectedLines = (value: unknown): value is Record<string, number> =>
  isRecord(value) &&
  Object.values(value).every(
    (amount) => typeof amount === 'number' && Number.isInteger(amount) && amount > 0,
  );

const isOptionalNumber = (value: unknown) => value === undefined || typeof value === 'number';
const isOptionalString = (value: unknown) => value === undefined || typeof value === 'string';

const isClaimAttachment = (value: unknown): value is ClaimAttachment =>
  isRecord(value) &&
  typeof value.localId === 'string' &&
  typeof value.fileName === 'string' &&
  typeof value.size === 'number' &&
  typeof value.mimeType === 'string' &&
  typeof value.lastModified === 'number' &&
  value.status === 'selected' &&
  value.file instanceof File &&
  isOptionalNumber(value.attachmentType) &&
  isOptionalNumber(value.attachmentTypeOrder) &&
  isOptionalString(value.attachmentTypeName);

const isClaimAttachments = (value: unknown): value is ClaimAttachment[] =>
  Array.isArray(value) && value.every(isClaimAttachment);

export const isPersistedClaimDraft = (value: unknown): value is PersistedClaimDraft => {
  if (!isRecord(value)) return false;

  return (
    value.version === CLAIM_DRAFT_VERSION &&
    typeof value.savedAt === 'string' &&
    Number.isInteger(value.step) &&
    typeof value.step === 'number' &&
    value.step >= 0 &&
    value.step <= 3 &&
    isSelectedLines(value.selectedLines) &&
    typeof value.reasonId === 'string' &&
    typeof value.clientDemandId === 'string' &&
    typeof value.flawId === 'string' &&
    isClaimAttachments(value.attachments)
  );
};

export const fromPersistedClaimDraft = (draft: PersistedClaimDraft): ClaimFormState => ({
  step: draft.step,
  selectedLines: draft.selectedLines,
  reasonId: draft.reasonId,
  clientDemandId: draft.clientDemandId,
  flawId: draft.flawId,
  attachments: draft.attachments,
});

export const getDraftKey = (documentId: string) =>
  `${CLAIM_DRAFT_PREFIX}v${CLAIM_DRAFT_VERSION}:${documentId}`;

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
