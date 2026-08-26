import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  fromPersistedClaimDraft,
  getDraftKey,
  getLegacyDraftKey,
  getPreviousDraftKey,
  isLegacyPersistedClaimDraft,
  isPersistedClaimDraft,
  isPreviousPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimDraft';
import { removeOutdatedClaimDrafts } from './claimDraftCleanup';

const configuration = configHelperFactory();

export const restoreClaimDraft = async (documentId: string) => {
  const currentDraft = await configuration.getConfiguration(
    getDraftKey(documentId),
    null,
    isPersistedClaimDraft,
  );
  if (currentDraft) {
    await removeOutdatedClaimDrafts(documentId);
    return fromPersistedClaimDraft(currentDraft);
  }

  const previousDraft = await configuration.getConfiguration(
    getPreviousDraftKey(documentId),
    null,
    isPreviousPersistedClaimDraft,
  );
  const restorableDraft =
    previousDraft ??
    (await configuration.getConfiguration(
      getLegacyDraftKey(documentId),
      null,
      isLegacyPersistedClaimDraft,
    ));
  if (!restorableDraft) {
    await removeOutdatedClaimDrafts(documentId);
    return null;
  }

  const migratedDraft = fromPersistedClaimDraft(restorableDraft);
  await configuration.setConfiguration(
    getDraftKey(documentId),
    toPersistedClaimDraft(migratedDraft),
  );
  await removeOutdatedClaimDrafts(documentId);
  return migratedDraft;
};
