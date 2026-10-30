import { addSelectedFiles } from './updateAttachments';

const file = (name: string, size: number) => {
  const value = new File(['bytes'], name);
  Object.defineProperty(value, 'size', { value: size });
  return value;
};

test('rejects excess files in a multi-selection before reading them', () => {
  const first = file('first.mp4', __MAX_ATTACHMENTS_SIZE_BYTES__);
  const result = addSelectedFiles({ attachments: [], files: [first, file('extra.jpg', 1)] });
  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0].file).toBe(first);
  expect(result.error).toContain('extra.jpg');
  expect(result.error).toContain('100 МБ');
});

test('counts previously added files towards the limit', () => {
  const existing = addSelectedFiles({
    attachments: [],
    files: [file('first.mp4', __MAX_ATTACHMENTS_SIZE_BYTES__)],
  });
  const result = addSelectedFiles({
    attachments: existing.attachments,
    files: [file('extra.jpg', 1)],
  });
  expect(result.attachments).toEqual(existing.attachments);
  expect(result.error).toContain('extra.jpg');
});
