import { configHelperFactory } from 'src/shared/lib/configurations';
import { getOutdatedDraftKeys } from './claimDraft';

const configuration = configHelperFactory();

export const removeOutdatedClaimDrafts = async (documentId: string) => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(
    getOutdatedDraftKeys(keys, documentId).map((key) => configuration.removeConfiguration(key)),
  );
};
