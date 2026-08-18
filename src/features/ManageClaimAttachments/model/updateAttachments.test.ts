import type { ClaimAttachment } from 'src/entities/Claim';
import { addSelectedFiles, removeAttachment } from './updateAttachments';

test('adds selected files with attachment type metadata', () => {
  const file = new File(['photo'], 'damage.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const result = addSelectedFiles({
    attachments: [],
    files: [file],
    attachmentType: { order: 20, type: 1, name: 'Фото товара', minAmount: 1 },
  });

  expect(result.error).toBeUndefined();
  expect(result.attachments[0]).toMatchObject({
    fileName: 'damage.jpg',
    attachmentType: 1,
    attachmentTypeOrder: 20,
    status: 'selected',
    file,
  });
});

test('replaces restored metadata and removes the selected attachment locally', () => {
  const restored: ClaimAttachment = {
    localId: 'attachment-1',
    fileName: 'damage.jpg',
    size: 5,
    mimeType: 'image/jpeg',
    lastModified: 123,
    status: 'needs-file',
  };
  const file = new File(['photo'], 'damage.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const result = addSelectedFiles({
    attachments: [restored],
    files: [file],
  });

  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0]).toMatchObject({ localId: 'attachment-1', status: 'selected' });
  expect(removeAttachment(result.attachments, 'attachment-1')).toEqual([]);
});
