import { useState } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { isLoginRedirecting } from 'src/shared/lib/auth';
import { configHelperFactory } from 'src/shared/lib/configurations';
import { getDraftKey, isPersistedClaimDraft } from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import { useClaimDraft } from './useClaimDraft';

jest.mock('src/shared/lib/auth', () => ({
  isLoginRedirecting: jest.fn(() => false),
}));

const configuration = configHelperFactory();
const documentId = 'login-redirect-test';

afterEach(async () => {
  await configuration.removeConfiguration(getDraftKey(documentId));
  jest.clearAllMocks();
  jest.mocked(isLoginRedirecting).mockReturnValue(false);
});

test('keeps normal autosave and suppresses the unload warning during login redirect', async () => {
  const { result, unmount } = renderHook(() => {
    const [formState, setFormState] = useState(createEmptyClaimForm);
    const draft = useClaimDraft({
      documentId,
      claimNumber: '',
      isDocumentLoaded: true,
      formState,
      setFormState,
    });
    return { ...draft, setFormState };
  });
  await waitFor(() => expect(result.current.isHydrated).toBe(true));
  act(() => {
    result.current.setFormState((current) => ({ ...current, description: 'Актуальный текст' }));
  });

  const beforeSave = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(beforeSave);
  expect(beforeSave.defaultPrevented).toBe(true);

  await waitFor(async () => {
    const saved = await configuration.getConfiguration(
      getDraftKey(documentId),
      undefined,
      isPersistedClaimDraft,
    );
    expect(saved?.description).toBe('Актуальный текст');
  });

  jest.mocked(isLoginRedirecting).mockReturnValue(true);
  const afterSave = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(afterSave);
  expect(afterSave.defaultPrevented).toBe(false);
  unmount();
});
