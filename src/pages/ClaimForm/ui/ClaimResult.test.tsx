import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useSubmitClaim } from 'src/features/SubmitClaim';
import { ClaimResult } from './ClaimResult';
import { removeClaimDraft } from '../model/useClaimDraft';
import { useClaimFormNavigation } from '../model/useClaimFormNavigation';
import { useClaimFormState } from '../model/useClaimFormState';

jest.mock('src/features/SubmitClaim', () => ({ useSubmitClaim: jest.fn() }));
jest.mock('../model/useClaimDraft', () => ({ removeClaimDraft: jest.fn() }));
jest.mock('../model/claimFormValidation', () => ({ isClaimStepValid: () => true }));

const submitClaim = jest.fn();
const onReturnToDocument = jest.fn();
const data = {
  areAttachmentTypesReady: true,
  areDetailsReady: true,
  attachmentTypes: [],
  flaws: [],
  products: [],
  selectedLineIds: [],
} as unknown as Parameters<typeof useClaimFormNavigation>[0]['data'];

const TestForm = () => {
  const state = useClaimFormState();
  const navigation = useClaimFormNavigation({
    data,
    documentId: 'document-1',
    state: { ...state, formState: { ...state.formState, step: 3 } },
  });
  return state.claimNumber ? (
    <ClaimResult
      claimNumber={state.claimNumber}
      draftCleanupStatus={navigation.draftCleanupStatus}
      onRetryDraftCleanup={navigation.retryDraftCleanup}
      onReturnToDocument={onReturnToDocument}
    />
  ) : (
    <button onClick={navigation.goNext}>Отправить</button>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  submitClaim.mockResolvedValue('claim-1');
  jest.mocked(useSubmitClaim).mockReturnValue({ submitClaim, isCreatingClaim: false });
});

test('blocks return until draft deletion completes after successful submission', async () => {
  const deletion = { complete: () => undefined as void };
  jest.mocked(removeClaimDraft).mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        deletion.complete = resolve;
      }),
  );
  render(<TestForm />);
  fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
  const returnButton = await screen.findByRole('button', { name: 'Вернуться к документу' });
  expect(screen.getByText('claim-1')).toBeInTheDocument();
  expect(returnButton).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Удаляем черновик');
  fireEvent.click(returnButton);
  expect(onReturnToDocument).not.toHaveBeenCalled();
  expect(removeClaimDraft).toHaveBeenCalledWith('document-1');
  deletion.complete();
  await waitFor(() => expect(returnButton).toBeEnabled());
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  fireEvent.click(returnButton);
  expect(onReturnToDocument).toHaveBeenCalledTimes(1);
});

test('allows return on cleanup failure and retries deletion without resubmitting', async () => {
  const retry = { complete: () => undefined as void };
  jest
    .mocked(removeClaimDraft)
    .mockRejectedValueOnce(new Error('Storage error'))
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          retry.complete = resolve;
        }),
    );
  render(<TestForm />);
  fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Претензия создана');
  const returnButton = screen.getByRole('button', { name: 'Вернуться к документу' });
  expect(returnButton).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Повторить удаление' }));
  expect(returnButton).toBeDisabled();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  retry.complete();
  await waitFor(() => expect(returnButton).toBeEnabled());
  expect(removeClaimDraft).toHaveBeenCalledTimes(2);
  expect(submitClaim).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button', { name: 'Повторить удаление' })).not.toBeInTheDocument();
});
