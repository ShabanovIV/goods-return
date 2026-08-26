import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  createEmptyClaimForm,
  fromPersistedClaimDraft,
  getOutdatedDraftKeys,
  isPersistedClaimDraft,
  removeOutdatedClaimDrafts,
  toPersistedClaimDraft,
} from './claimForm';

const configuration = configHelperFactory();

afterEach(async () => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(keys.map((key) => configuration.removeConfiguration(key)));
});

test('persists selected attachment files and metadata', () => {
  const file = new File(['photo'], 'damage.jpg', { type: 'image/jpeg', lastModified: 123 });
  const draft = toPersistedClaimDraft({
    ...createEmptyClaimForm(),
    step: 2,
    reasonId: 'reason-1',
    flawId: 'flaw-1',
    description: 'Суть претензии',
    isLeftAddress: false,
    isOpenClient: true,
    attachments: [
      {
        localId: 'attachment-1',
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
        lastModified: file.lastModified,
        status: 'selected',
        file,
      },
    ],
  });

  expect(draft.attachments[0]).toMatchObject({ fileName: 'damage.jpg', file });
  expect(isPersistedClaimDraft(draft)).toBe(true);
  expect(fromPersistedClaimDraft(draft)).toMatchObject({
    reasonId: 'reason-1',
    flawId: 'flaw-1',
    description: 'Суть претензии',
    isLeftAddress: false,
    isOpenClient: true,
    attachments: [{ fileName: 'damage.jpg', file }],
  });
});

test('rejects an older draft without restorable attachment files', () => {
  const legacyDraft = {
    ...toPersistedClaimDraft(createEmptyClaimForm()),
    version: 2,
    attachments: [{ fileName: 'old-photo.jpg', status: 'needs-file' }],
  };

  expect(isPersistedClaimDraft(legacyDraft)).toBe(false);
});

test('rejects drafts with the old multiple flaw selection', () => {
  const legacyDraft = {
    ...toPersistedClaimDraft(createEmptyClaimForm()),
    version: 1,
    flawIds: ['flaw-1'],
  };

  expect(isPersistedClaimDraft(legacyDraft)).toBe(false);
});

test('finds only outdated drafts for the current document', () => {
  const keys = [
    'goods-return:claim-draft:v1:document-1',
    'goods-return:claim-draft:v2:document-1',
    'goods-return:claim-draft:v3:document-1',
    'goods-return:claim-draft:v4:document-1',
    'goods-return:claim-draft:v5:document-1',
    'goods-return:claim-draft:v6:document-1',
    'goods-return:claim-draft:v1:document-2',
    'another-setting',
  ];

  expect(getOutdatedDraftKeys(keys, 'document-1')).toEqual([
    'goods-return:claim-draft:v1:document-1',
    'goods-return:claim-draft:v2:document-1',
    'goods-return:claim-draft:v3:document-1',
    'goods-return:claim-draft:v4:document-1',
  ]);
});

test('removes outdated drafts without touching current or other document drafts', async () => {
  await configuration.setConfiguration('goods-return:claim-draft:v1:document-1', {});
  await configuration.setConfiguration('goods-return:claim-draft:v5:document-1', {});
  await configuration.setConfiguration('goods-return:claim-draft:v1:document-2', {});

  await removeOutdatedClaimDrafts('document-1');

  expect(await configuration.getConfigurationKeys()).toEqual(
    expect.arrayContaining([
      'goods-return:claim-draft:v5:document-1',
      'goods-return:claim-draft:v1:document-2',
    ]),
  );
  expect(await configuration.getConfigurationKeys()).not.toContain(
    'goods-return:claim-draft:v1:document-1',
  );
});
