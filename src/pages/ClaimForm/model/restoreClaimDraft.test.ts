import { configHelperFactory } from 'src/shared/lib/configurations';
import { getDraftKey, isPersistedClaimDraft, toPersistedClaimDraft } from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import { restoreClaimDraft } from './restoreClaimDraft';

const configuration = configHelperFactory();
afterEach(async () => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(keys.map((key) => configuration.removeConfiguration(key)));
});

test.each([3, 4, 5, 6])(
  'discards version %i without migrating old fingerprints',
  async (version) => {
    const key = 'goods-return:claim-draft:v' + version + ':document-1';
    const draft = { ...toPersistedClaimDraft(createEmptyClaimForm()), version };
    await configuration.setConfiguration(key, draft);
    expect(isPersistedClaimDraft(draft)).toBe(false);
    expect(await restoreClaimDraft('document-1')).toBeNull();
    expect(await configuration.getConfigurationKeys()).not.toContain(key);
    expect(await configuration.getConfigurationKeys()).not.toContain(getDraftKey('document-1'));
  },
);

test('restores version 7 files and fingerprints and removes only older drafts of this document', async () => {
  const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg', lastModified: 123 });
  const state = {
    ...createEmptyClaimForm(),
    description: 'Saved description',
    attachments: [
      {
        localId: 'file',
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
        lastModified: file.lastModified,
        status: 'selected' as const,
        sourceFingerprint: 'photo.jpg:5',
        file,
      },
    ],
  };
  const draft = toPersistedClaimDraft(state);
  expect(draft.version).toBe(7);
  expect(getDraftKey('document-1')).toBe('goods-return:claim-draft:v7:document-1');
  await configuration.setConfiguration(getDraftKey('document-1'), draft);
  await configuration.setConfiguration('goods-return:claim-draft:v6:document-1', {});
  await configuration.setConfiguration('goods-return:claim-draft:v6:document-2', {});
  expect(await restoreClaimDraft('document-1')).toEqual(state);
  expect(await configuration.getConfigurationKeys()).not.toContain(
    'goods-return:claim-draft:v6:document-1',
  );
  expect(await configuration.getConfigurationKeys()).toContain(
    'goods-return:claim-draft:v6:document-2',
  );
});
