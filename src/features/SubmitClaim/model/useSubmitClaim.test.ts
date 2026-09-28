import { act, renderHook } from '@testing-library/react';
import { useCreateClaimMutation } from 'src/entities/Claim';
import { useSubmitClaim } from './useSubmitClaim';

jest.mock('src/entities/Claim', () => ({
  useCreateClaimMutation: jest.fn(),
}));

const submitArguments = {
  attachments: [],
  clientDemandId: 'demand',
  description: 'description',
  documentId: 'document',
  flawId: 'flaw',
  isLeftAddress: false,
  isOpenClient: false,
  reasonId: 'reason',
  selectedLines: { product: 1 },
};

test('returns the claim number from the API Data field', async () => {
  const unwrap = jest.fn().mockResolvedValue({
    Data: '107798-2026-P',
    ErrorCode: null,
    Error: null,
    Success: true,
    TraceId: null,
  });
  jest
    .mocked(useCreateClaimMutation)
    .mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as unknown as ReturnType<
      typeof useCreateClaimMutation
    >);
  const { result } = renderHook(useSubmitClaim);

  await expect(result.current.submitClaim(submitArguments)).resolves.toBe('107798-2026-P');
  expect(unwrap).toHaveBeenCalledTimes(1);
});

test('rejects a successful response without a claim number', async () => {
  const unwrap = jest.fn().mockResolvedValue({
    Data: null,
    ErrorCode: null,
    Error: null,
    Success: true,
    TraceId: null,
  });
  jest
    .mocked(useCreateClaimMutation)
    .mockReturnValue([jest.fn(() => ({ unwrap })), { isLoading: false }] as unknown as ReturnType<
      typeof useCreateClaimMutation
    >);
  const { result } = renderHook(useSubmitClaim);

  await act(async () => {
    await expect(result.current.submitClaim(submitArguments)).rejects.toThrow(
      'Сервер не вернул номер созданной претензии.',
    );
  });
});
