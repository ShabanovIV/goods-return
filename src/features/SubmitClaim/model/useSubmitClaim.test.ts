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

test.each(['processing', 'error'] as const)(
  'blocks API submission for %s photos',
  async (status) => {
    const createClaim = jest.fn();
    jest
      .mocked(useCreateClaimMutation)
      .mockReturnValue([createClaim, { isLoading: false }] as unknown as ReturnType<
        typeof useCreateClaimMutation
      >);
    const { result } = renderHook(useSubmitClaim);
    await expect(
      result.current.submitClaim({
        ...submitArguments,
        attachments: [
          {
            localId: 'photo',
            fileName: 'photo.heic',
            size: 4,
            mimeType: 'image/heic',
            lastModified: 123,
            status,
            file: new File(['heic'], 'photo.heic'),
          },
        ],
      }),
    ).rejects.toThrow('Дождитесь подготовки файлов');
    expect(createClaim).not.toHaveBeenCalled();
  },
);

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
    await expect(result.current.submitClaim(submitArguments)).rejects.toMatchObject({
      status: 'CUSTOM_ERROR',
      data: { Success: true },
      error: expect.stringContaining('Сервер не вернул номер созданной претензии.'),
    });
  });
});

test('blocks oversized restored attachments before calling the API', async () => {
  const createClaim = jest.fn();
  jest
    .mocked(useCreateClaimMutation)
    .mockReturnValue([createClaim, { isLoading: false }] as unknown as ReturnType<
      typeof useCreateClaimMutation
    >);
  const { result } = renderHook(useSubmitClaim);
  await expect(
    result.current.submitClaim({
      ...submitArguments,
      attachments: [
        {
          localId: 'large',
          fileName: 'large.mp4',
          size: __MAX_ATTACHMENTS_SIZE_BYTES__ + 1,
          mimeType: 'video/mp4',
          lastModified: 1,
          status: 'selected',
        },
      ],
    }),
  ).rejects.toThrow('Общий размер вложений превышает');
  expect(createClaim).not.toHaveBeenCalled();
});
