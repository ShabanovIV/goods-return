/* eslint-disable max-lines */
import type { ClaimAttachmentMetadata } from 'src/entities/Claim';

export const CLAIM_STEPS = ['Товары', 'Обращение', 'Вложения', 'Проверка'] as const;

export type ClaimStep = 0 | 1 | 2 | 3;

export type SelectedLine = {
  lineId: string;
  amount: number;
};

export type AttachmentStatus = 'selected' | 'uploaded' | 'needs-file';

export type ClaimAttachment = ClaimAttachmentMetadata & {
  lastModified: number;
  status: AttachmentStatus;
  file?: File;
};

export type ClaimFormState = {
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  attachments: ClaimAttachment[];
};

type PersistedAttachment = Omit<ClaimAttachment, 'file' | 'status'> & {
  status: 'uploaded' | 'needs-file';
};

export type PersistedClaimDraft = {
  version: 1;
  savedAt: string;
  step: ClaimStep;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  attachments: PersistedAttachment[];
};

export const createEmptyClaimForm = (): ClaimFormState => ({
  step: 0,
  selectedLines: {},
  reasonId: '',
  clientDemandId: '',
  flawIds: [],
  attachments: [],
});

export const toPersistedClaimDraft = (state: ClaimFormState): PersistedClaimDraft => ({
  version: 1,
  savedAt: new Date().toISOString(),
  step: state.step,
  selectedLines: state.selectedLines,
  reasonId: state.reasonId,
  clientDemandId: state.clientDemandId,
  flawIds: state.flawIds,
  attachments: state.attachments.map(({ file: _file, status, ...attachment }) => ({
    ...attachment,
    status: status === 'uploaded' ? 'uploaded' : 'needs-file',
  })),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isSelectedLines = (value: unknown): value is Record<string, number> =>
  isRecord(value) &&
  Object.values(value).every(
    (amount) => typeof amount === 'number' && Number.isInteger(amount) && amount > 0,
  );

const isPersistedAttachment = (value: unknown): value is PersistedAttachment => {
  if (!isRecord(value)) return false;

  return (
    typeof value.localId === 'string' &&
    typeof value.fileName === 'string' &&
    typeof value.size === 'number' &&
    typeof value.mimeType === 'string' &&
    typeof value.lastModified === 'number' &&
    (value.status === 'uploaded' || value.status === 'needs-file') &&
    (value.attachmentType === undefined || typeof value.attachmentType === 'number') &&
    (value.attachmentTypeOrder === undefined || typeof value.attachmentTypeOrder === 'number') &&
    (value.attachmentTypeName === undefined || typeof value.attachmentTypeName === 'string')
  );
};

export const isPersistedClaimDraft = (value: unknown): value is PersistedClaimDraft => {
  if (!isRecord(value)) return false;

  return (
    value.version === 1 &&
    typeof value.savedAt === 'string' &&
    Number.isInteger(value.step) &&
    typeof value.step === 'number' &&
    value.step >= 0 &&
    value.step <= 3 &&
    isSelectedLines(value.selectedLines) &&
    typeof value.reasonId === 'string' &&
    typeof value.clientDemandId === 'string' &&
    isStringArray(value.flawIds) &&
    Array.isArray(value.attachments) &&
    value.attachments.every(isPersistedAttachment)
  );
};

export const fromPersistedClaimDraft = (draft: PersistedClaimDraft): ClaimFormState => ({
  step: draft.step,
  selectedLines: draft.selectedLines,
  reasonId: draft.reasonId,
  clientDemandId: draft.clientDemandId,
  flawIds: draft.flawIds,
  attachments: draft.attachments.map((attachment) => ({ ...attachment })),
});

export const getDraftKey = (documentId: string) => `goods-return:claim-draft:v1:${documentId}`;

export const getFileFingerprint = (file: Pick<File, 'lastModified' | 'name' | 'size'>) =>
  `${file.name}:${file.size}:${file.lastModified}`;

export const getAttachmentFingerprint = (
  attachment: Pick<ClaimAttachment, 'fileName' | 'lastModified' | 'size'>,
) => `${attachment.fileName}:${attachment.size}:${attachment.lastModified}`;
