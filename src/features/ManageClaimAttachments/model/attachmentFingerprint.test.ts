import { prepareSelectedAttachments } from './updateAttachments';

const file = (name = 'photo.jpg', content = 'photo', lastModified = 1) =>
  new File([content], name, { type: 'image/jpeg', lastModified });

test('rejects equal names and sizes regardless of modification time or contents', () => {
  const result = prepareSelectedAttachments({
    attachments: [],
    files: [file(), file('photo.jpg', 'other', 999)],
  });
  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0].sourceFingerprint).toBe('photo.jpg:5');
  expect(result.rejected).toEqual([{ inputIndex: 1, fileName: 'photo.jpg', reason: 'duplicate' }]);
});

test('accepts a different name or size', () => {
  const result = prepareSelectedAttachments({
    attachments: [],
    files: [file(), file('other.jpg'), file('photo.jpg', 'larger')],
  });
  expect(result.attachments).toHaveLength(3);
  expect(result.rejected).toEqual([]);
});

test('uses name and size for attachments without a stored fingerprint', () => {
  const original = prepareSelectedAttachments({ attachments: [], files: [file()] }).attachments[0];
  const result = prepareSelectedAttachments({
    attachments: [{ ...original, sourceFingerprint: undefined }],
    files: [file('photo.jpg', 'photo', 999)],
  });
  expect(result.added).toEqual([]);
  expect(result.rejected[0].reason).toBe('duplicate');
});

test('keeps detecting the source after conversion changes name and size', () => {
  const original = prepareSelectedAttachments({ attachments: [], files: [file('photo.heic')] })
    .attachments[0];
  const result = prepareSelectedAttachments({
    attachments: [{ ...original, fileName: 'photo.jpg', size: 100 }],
    files: [file('photo.heic', 'photo', 999)],
  });
  expect(result.added).toEqual([]);
  expect(result.rejected[0].reason).toBe('duplicate');
});
