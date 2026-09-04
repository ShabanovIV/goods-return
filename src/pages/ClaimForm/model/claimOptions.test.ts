import { fromPersistedClaimDraft, toPersistedClaimDraft } from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';

test('starts with both claim options disabled', () => {
  expect(createEmptyClaimForm()).toMatchObject({ isLeftAddress: false, isOpenClient: false });
});

test('preserves explicitly saved options instead of replacing them with new defaults', () => {
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    isLeftAddress: true,
    isOpenClient: true,
  });
  expect(fromPersistedClaimDraft(draft)).toMatchObject({ isLeftAddress: true, isOpenClient: true });
});
