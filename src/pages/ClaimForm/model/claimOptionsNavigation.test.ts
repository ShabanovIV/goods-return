import { act, renderHook } from '@testing-library/react';
import { useSubmitClaim } from 'src/features/SubmitClaim';
import { useClaimFormNavigation } from './useClaimFormNavigation';
import { useClaimFormState } from './useClaimFormState';
import type { ClaimStep } from '../types/claimForm';

jest.mock('src/features/SubmitClaim', () => ({ useSubmitClaim: jest.fn() }));
jest.mock('./useClaimDraft', () => ({ removeClaimDraft: jest.fn() }));

const submitClaim = jest.fn().mockResolvedValue('claim-1');
const data = {
  areAttachmentTypesReady: true,
  areDetailsReady: true,
  attachmentTypes: [],
  flaws: [],
  products: [{ lineId: 'line-1', amount: 1 }],
  selectedLineIds: ['line-1'],
} as unknown as Parameters<typeof useClaimFormNavigation>[0]['data'];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window, 'scrollTo').mockImplementation();
  jest.mocked(useSubmitClaim).mockReturnValue({ submitClaim, isCreatingClaim: false });
});

afterEach(() => jest.restoreAllMocks());

const setup = (step: ClaimStep, isLeftAddress: boolean | null, isOpenClient: boolean | null) => {
  const hook = renderHook(() => {
    const state = useClaimFormState();
    const navigation = useClaimFormNavigation({ data, documentId: 'document-1', state });
    return { state, navigation };
  });
  act(() =>
    hook.result.current.state.setFormState((current) => ({
      ...current,
      step,
      isLeftAddress,
      isOpenClient,
      selectedLines: { 'line-1': 1 },
      reasonId: 'reason',
      clientDemandId: 'demand',
      description: 'Описание',
    })),
  );
  return hook;
};

test.each([
  [null, null],
  [null, false],
  [true, null],
])('blocks next and submission for unanswered options %s / %s', async (left, open) => {
  for (const step of [1, 3] as const) {
    const { result, unmount } = setup(step, left, open);
    await act(async () => result.current.navigation.goNext());
    expect(result.current.state.formState.step).toBe(1);
    expect(result.current.state.showErrors).toBe(true);
    expect(submitClaim).not.toHaveBeenCalled();
    unmount();
  }
});

test.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])('allows next and submits explicit answers %s / %s', async (left, open) => {
  const { result } = setup(1, left, open);
  act(() => result.current.navigation.goNext());
  expect(result.current.state.formState.step).toBe(2);
  act(() => result.current.navigation.goNext());
  await act(async () => result.current.navigation.goNext());
  expect(submitClaim).toHaveBeenCalledWith(
    expect.objectContaining({ isLeftAddress: left, isOpenClient: open }),
  );
});
