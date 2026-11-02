import { configHelperFactory } from 'src/shared/lib/configurations';
import { fromPersistedClaimDraft, getDraftKey, isPersistedClaimDraft } from './claimDraft';
import { removeOutdatedClaimDrafts } from './claimDraftCleanup';

const configuration = configHelperFactory();

export const restoreClaimDraft = async (documentId: string) => {
  const draft = await configuration.getConfiguration(
    getDraftKey(documentId),
    null,
    isPersistedClaimDraft,
  );
  // Older drafts contain incompatible attachment fingerprints and are not migrated.
  await removeOutdatedClaimDrafts(documentId);
  return draft ? fromPersistedClaimDraft(draft) : null;
};
