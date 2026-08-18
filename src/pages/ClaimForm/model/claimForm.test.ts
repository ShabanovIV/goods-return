import {
  createEmptyClaimForm,
  fromPersistedClaimDraft,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimForm';

test('persists only attachment metadata and restores an unfinished file safely', () => {
  const file = new File(['photo'], 'damage.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    step: 2,
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

  expect(draft.attachments[0]).not.toHaveProperty('file');
  expect(draft.attachments[0].status).toBe('needs-file');
  expect(isPersistedClaimDraft(draft)).toBe(true);

  const restored = fromPersistedClaimDraft(draft);
  expect(restored.attachments[0].status).toBe('needs-file');
  expect(restored.attachments[0]).not.toHaveProperty('file');
});

test('keeps successfully uploaded attachment metadata in the draft', () => {
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    attachments: [
      {
        localId: 'attachment-2',
        fileName: 'video.mp4',
        size: 1024,
        mimeType: 'video/mp4',
        lastModified: 456,
        attachmentType: 2,
        attachmentTypeOrder: 20,
        attachmentTypeName: 'Видео дефекта',
        status: 'uploaded',
      },
    ],
  });

  expect(draft.attachments[0]).toMatchObject({
    fileName: 'video.mp4',
    attachmentType: 2,
    attachmentTypeOrder: 20,
    status: 'uploaded',
  });
});
