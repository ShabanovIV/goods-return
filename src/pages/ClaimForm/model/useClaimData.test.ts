import { renderHook } from '@testing-library/react';
import { createEmptyClaimForm } from './claimFormState';
import { useClaimData } from './useClaimData';

const mockAttachmentQuery = jest.fn();
const details = [
  { lineId: 'line-a', productId: 'product-a', isProduct: true },
  { lineId: 'line-b', productId: 'product-a', isProduct: true },
  { lineId: 'line-service', productId: 'service', isProduct: false },
  { lineId: 'unselected', productId: 'unselected', isProduct: true },
];
jest.mock('src/entities/Document', () => ({
  useGetDocumentQuery: () => ({ data: { success: true, data: { details } } }),
}));
jest.mock('src/entities/Claim', () => ({
  useGetAttachmentTypesQuery: (...args: unknown[]) => mockAttachmentQuery(...args),
  useGetReasonsQuery: () => ({}),
  useGetClientDemandsQuery: () => ({}),
  useGetFlawsQuery: () => ({}),
}));

beforeEach(() => mockAttachmentQuery.mockReset());

test('requests unique product IDs for selected goods and services and skips empty selection', () => {
  mockAttachmentQuery.mockReturnValue({});
  const { rerender } = renderHook(
    (selectedLines: Record<string, number>) =>
      useClaimData('document', { ...createEmptyClaimForm(), selectedLines }),
    { initialProps: { 'line-a': 1, 'line-b': 2, 'line-service': 1 } as Record<string, number> },
  );
  expect(mockAttachmentQuery).toHaveBeenLastCalledWith(
    { productIds: ['product-a', 'service'] },
    { skip: false },
  );
  rerender({ 'line-service': 1 });
  expect(mockAttachmentQuery).toHaveBeenLastCalledWith(
    { productIds: ['service'] },
    { skip: false },
  );
  rerender({});
  expect(mockAttachmentQuery).toHaveBeenLastCalledWith({ productIds: [] }, { skip: true });
});

test.each([
  [{ data: { success: true, data: [] } }, false],
  [{ currentData: { success: true, data: [] }, isFetching: true }, false],
  [{ currentData: { success: false, error: 'Failed' } }, false],
  [{ currentData: { success: true, data: [] }, error: { status: 500 } }, false],
  [{ currentData: { success: true, data: [] } }, true],
])('only accepts successful current requirements: %j', (query, ready) => {
  mockAttachmentQuery.mockReturnValue(query);
  const { result } = renderHook(() =>
    useClaimData('document', {
      ...createEmptyClaimForm(),
      selectedLines: { 'line-service': 1 },
    }),
  );
  expect(result.current.areAttachmentTypesReady).toBe(ready);
});
