import { createClaimFormData } from './createClaimFormData';

test('creates the Claim/Create multipart form with all files', () => {
  const files = [
    new File(['photo'], 'damage.jpg', { type: 'image/jpeg' }),
    new File(['video'], 'damage.mp4', { type: 'video/mp4' }),
  ];
  const formData = createClaimFormData({
    documentId: '{document-id}',
    products: [{ id: 'line-1', quantity: 2 }],
    reason: 'reason-1',
    flaw: 'flaw-1',
    requirement: 'requirement-1',
    description: '  Суть претензии  ',
    isLeftAddress: false,
    isOpenClient: true,
    files,
  });

  expect(formData.get('DocumentId')).toBe('{document-id}');
  expect(formData.get('Products[0][Id]')).toBe('line-1');
  expect(formData.get('Products[0][Quantity]')).toBe('2');
  expect(formData.get('Reason')).toBe('reason-1');
  expect(formData.get('Flaw')).toBe('flaw-1');
  expect(formData.get('Requirement')).toBe('requirement-1');
  expect(formData.get('Description')).toBe('Суть претензии');
  expect(formData.get('IsLeftAddress')).toBe('false');
  expect(formData.get('IsOpenClient')).toBe('true');
  expect(formData.getAll('')).toEqual(files);
});
