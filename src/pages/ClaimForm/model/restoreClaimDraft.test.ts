import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  getDraftKey,
  getLegacyDraftKey,
  getPreviousDraftKey,
  isPersistedClaimDraft,
} from './claimDraft';
import { restoreClaimDraft } from './restoreClaimDraft';

const configuration = configHelperFactory();

afterEach(async () => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(keys.map((key) => configuration.removeConfiguration(key)));
});

test('still migrates a version 3 draft with attachment files', async () => {
  const file = new File(['photo'], 'older.jpg', { type: 'image/jpeg', lastModified: 123 });
  await configuration.setConfiguration(getLegacyDraftKey('document-1'), {
    version: 3,
    savedAt: new Date().toISOString(),
    step: 2,
    selectedLines: { 'line-1': 1 },
    reasonId: 'reason-1',
    clientDemandId: 'demand-1',
    flawId: 'flaw-1',
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

  const restored = await restoreClaimDraft('document-1');

  expect(restored).toMatchObject({
    description: '',
    isLeftAddress: true,
    isOpenClient: false,
    attachments: [{ file }],
  });
});

test('migrates a version 4 draft with default options without losing files', async () => {
  const file = new File(['photo'], 'legacy.jpg', { type: 'image/jpeg', lastModified: 321 });
  const previousDraft = {
    version: 4,
    savedAt: new Date().toISOString(),
    step: 2,
    selectedLines: { 'line-1': 1 },
    reasonId: 'reason-1',
    clientDemandId: 'demand-1',
    flawId: 'flaw-1',
    description: 'Описание',
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
  };
  await configuration.setConfiguration(getPreviousDraftKey('document-1'), previousDraft);

  const restored = await restoreClaimDraft('document-1');

  expect(restored).toMatchObject({
    description: 'Описание',
    isLeftAddress: true,
    isOpenClient: false,
    attachments: [{ file }],
  });
  expect(
    await configuration.getConfiguration(getDraftKey('document-1'), null, isPersistedClaimDraft),
  ).toMatchObject({ version: 5, attachments: [{ file }] });
  expect(await configuration.getConfigurationKeys()).not.toContain(
    getPreviousDraftKey('document-1'),
  );
});
