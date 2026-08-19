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
    attachmentType: {
      order: 20,
      type: 1,
      name: 'Фото товара',
      minAmount: 1,
      mediaType: 'image',
    },
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

test('rejects the same physical file for another type and removes it locally', () => {
  const existing: ClaimAttachment = {
    localId: 'attachment-1',
    fileName: 'damage.jpg',
    size: 5,
    mimeType: 'image/jpeg',
    lastModified: 123,
    attachmentType: 1,
    attachmentTypeOrder: 10,
    status: 'selected',
  };
  const file = new File(['photo'], 'damage.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const result = addSelectedFiles({
    attachments: [existing],
    files: [file],
    attachmentType: {
      order: 20,
      type: 2,
      name: 'Фото этикетки',
      minAmount: 0,
      mediaType: 'image',
    },
  });

  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0]).toBe(existing);
  expect(result.error).toContain('уже добавлен');
  expect(removeAttachment(result.attachments, 'attachment-1')).toEqual([]);
});

test('rejects an image selected for a video attachment type', () => {
  const file = new File(['photo'], 'damage.jpg', { type: 'image/jpeg' });
  const result = addSelectedFiles({
    attachments: [],
    files: [file],
    attachmentType: {
      order: 30,
      type: 3,
      name: 'Видео недостатка',
      minAmount: 0,
      mediaType: 'video',
    },
  });

  expect(result.attachments).toEqual([]);
  expect(result.error).toContain('не соответствует типу «Видео недостатка»');
});

test('accepts a video selected for a video attachment type', () => {
  const file = new File(['video'], 'damage.mp4', { type: 'video/mp4' });
  const result = addSelectedFiles({
    attachments: [],
    files: [file],
    attachmentType: {
      order: 30,
      type: 3,
      name: 'Видео недостатка',
      minAmount: 0,
      mediaType: 'video',
    },
  });

  expect(result.error).toBeUndefined();
  expect(result.attachments[0]).toMatchObject({ fileName: 'damage.mp4', file });
});
