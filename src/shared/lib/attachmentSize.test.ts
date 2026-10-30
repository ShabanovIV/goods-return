import { exceedsAttachmentsLimit, getAttachmentsSize } from './attachmentSize';

test('uses actual file bytes ahead of stale attachment metadata', () => {
  expect(getAttachmentsSize([{ size: 1, file: { size: 20 } }, { size: 3 }])).toBe(23);
});

test('allows the exact limit and rejects even one excess byte', () => {
  expect(exceedsAttachmentsLimit([{ size: __MAX_ATTACHMENTS_SIZE_BYTES__ }])).toBe(false);
  expect(exceedsAttachmentsLimit([{ size: __MAX_ATTACHMENTS_SIZE_BYTES__ }, { size: 1 }])).toBe(
    true,
  );
});
