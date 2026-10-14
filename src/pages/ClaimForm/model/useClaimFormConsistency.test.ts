import { useState } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { configHelperFactory } from 'src/shared/lib/configurations';
import { getDraftKey, isPersistedClaimDraft, toPersistedClaimDraft } from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import { useClaimDraft } from './useClaimDraft';
import { useClaimFormConsistency } from './useClaimFormConsistency';

const configuration = configHelperFactory();
const documentId = 'attachment-consistency-test';
const flaws: never[] = [];
const setPageError = jest.fn();
const attachments: ClaimAttachment[] = [10, 20].map((order) => ({
  localId: String(order),
  fileName: `${order}.png`,
  size: 1,
  mimeType: 'image/png',
  lastModified: 1,
  status: 'selected',
  attachmentTypeOrder: order,
  file: new File(['x'], `${order}.png`, { type: 'image/png' }),
}));

afterEach(() => configuration.removeConfiguration(getDraftKey(documentId)));

test('keeps files until requirements load, then cleans restored state and the saved draft', async () => {
  await configuration.setConfiguration(
    getDraftKey(documentId),
    toPersistedClaimDraft({
      ...createEmptyClaimForm(),
      attachments,
    }),
  );
  const { result, rerender } = renderHook(
    ({ types, loaded }: { types: AttachmentType[]; loaded: boolean }) => {
      const [formState, setFormState] = useState(createEmptyClaimForm);
      const draft = useClaimDraft({
        claimNumber: '',
        documentId,
        isDocumentLoaded: true,
        formState,
        setFormState,
      });
      useClaimFormConsistency({
        attachmentTypes: types,
        attachmentTypesLoaded: draft.isHydrated && loaded,
        flaws,
        flawsLoaded: false,
        setFormState,
        setPageError,
      });
      return { formState, ...draft };
    },
    { initialProps: { types: [] as AttachmentType[], loaded: false } },
  );

  await waitFor(() => expect(result.current.isHydrated).toBe(true));
  expect(result.current.formState.attachments).toHaveLength(2);
  rerender({ types: [{ order: 10, type: 1, name: 'Photo', minAmount: 0 }], loaded: true });
  expect(result.current.formState.attachments.map((file) => file.localId)).toEqual(['10']);
  await waitFor(async () => {
    const saved = await configuration.getConfiguration(
      getDraftKey(documentId),
      null,
      isPersistedClaimDraft,
    );
    expect(saved?.attachments.map((file) => file.localId)).toEqual(['10']);
  });
  rerender({ types: [], loaded: false });
  expect(result.current.formState.attachments).toHaveLength(1);
  rerender({ types: [], loaded: true });
  expect(result.current.formState.attachments).toEqual([]);
  await waitFor(async () => {
    const saved = await configuration.getConfiguration(
      getDraftKey(documentId),
      null,
      isPersistedClaimDraft,
    );
    expect(saved?.attachments).toEqual([]);
  });
});
