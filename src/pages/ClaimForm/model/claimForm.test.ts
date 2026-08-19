import {
  createEmptyClaimForm,
  fromPersistedClaimDraft,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimForm';

test('does not persist selected attachment files or metadata', () => {
  const file = new File(['photo'], 'damage.jpg', { type: 'image/jpeg', lastModified: 123 });
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    step: 2,
    reasonId: 'reason-1',
    flawId: 'flaw-1',
    attachments: [
      {
        localId: 'attachment-1',
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
        lastModified: file.lastModified,
        status: 'selected',
        file,
      },
    ],
  });

  expect(draft).not.toHaveProperty('attachments');
  expect(isPersistedClaimDraft(draft)).toBe(true);
  expect(fromPersistedClaimDraft(draft)).toMatchObject({
    reasonId: 'reason-1',
    flawId: 'flaw-1',
    attachments: [],
  });
});

test('ignores attachment metadata from an older saved draft', () => {
  const legacyDraft = {
    ...toPersistedClaimDraft(createEmptyClaimForm()),
    attachments: [{ fileName: 'old-photo.jpg', status: 'needs-file' }],
  };

  expect(isPersistedClaimDraft(legacyDraft)).toBe(true);
  expect(fromPersistedClaimDraft(legacyDraft).attachments).toEqual([]);
});

test('rejects drafts with the old multiple flaw selection', () => {
  const legacyDraft = {
    ...toPersistedClaimDraft(createEmptyClaimForm()),
    version: 1,
    flawIds: ['flaw-1'],
  };

  expect(isPersistedClaimDraft(legacyDraft)).toBe(false);
});
