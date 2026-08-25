import type { ClaimAttachment } from 'src/entities/Claim';

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

export const isDraftData = (
  value: unknown,
  version: number,
): value is Record<string, unknown> & {
  attachments: ClaimAttachment[];
  clientDemandId: string;
  flawId: string;
  reasonId: string;
  savedAt: string;
  selectedLines: Record<string, number>;
  step: 0 | 1 | 2 | 3;
} => {
  if (!isRecord(value)) return false;

  return (
    value.version === version &&
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
