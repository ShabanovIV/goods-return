import type { ClaimAttachment } from 'src/entities/Claim';
import { configHelperFactory } from 'src/shared/lib/configurations';
import { getDraftKey, isPersistedClaimDraft, toPersistedClaimDraft } from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import { restoreClaimDraft } from './restoreClaimDraft';

const attachment: ClaimAttachment = {
  localId: 'file',
  fileName: 'photo.jpg',
  size: 5,
  mimeType: 'image/jpeg',
  lastModified: 1,
  status: 'processing',
  file: new File(['photo'], 'photo.jpg'),
};

test.each(['processing', 'error'] as const)(
  'does not persist the original file with status %s',
  (status) => {
    const draft = toPersistedClaimDraft({
      ...createEmptyClaimForm(),
      attachments: [{ ...attachment, status }],
    });
    expect(draft.attachments[0]).toMatchObject({ status: 'error', fileName: 'photo.jpg' });
    expect(draft.attachments[0].file).toBeUndefined();
    expect(isPersistedClaimDraft(draft)).toBe(true);
  },
);

test('restores a read error without losing the rest of the draft', async () => {
  const configuration = configHelperFactory();
  const documentId = 'read-error-test';
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    description: 'Описание',
    attachments: [
      {
        ...attachment,
        status: 'error',
        file: undefined,
        errorReason: 'read',
        errorDetails: 'NotReadableError: File changed',
      },
    ],
  });
  try {
    await configuration.setConfiguration(getDraftKey(documentId), draft);
    expect(await restoreClaimDraft(documentId)).toMatchObject({
      description: 'Описание',
      attachments: [{ status: 'error', errorReason: 'read', fileName: 'photo.jpg' }],
    });
  } finally {
    await configuration.removeConfiguration(getDraftKey(documentId));
  }
});

test('persists ready files and rejects selected attachments without files', () => {
  const state = {
    ...createEmptyClaimForm(),
    attachments: [{ ...attachment, status: 'selected' as const }],
  };
  const draft = toPersistedClaimDraft(state);
  expect(draft.attachments[0].file).toBe(attachment.file);
  expect(isPersistedClaimDraft(draft)).toBe(true);
  draft.attachments[0] = { ...draft.attachments[0], file: undefined };
  expect(isPersistedClaimDraft(draft)).toBe(false);
});
