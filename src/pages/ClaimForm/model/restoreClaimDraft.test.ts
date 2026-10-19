import { configHelperFactory } from 'src/shared/lib/configurations';
import {
  getDraftKey,
  getLegacyDraftKey,
  getPreviousDraftKey,
  getSwitchDraftKey,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from './claimDraft';
import { createEmptyClaimForm } from './claimFormState';
import { restoreClaimDraft } from './restoreClaimDraft';

const configuration = configHelperFactory();

afterEach(async () => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(keys.map((key) => configuration.removeConfiguration(key)));
});

test('preserves version 5 answers, current step and other data', async () => {
  const draft = {
    ...toPersistedClaimDraft(createEmptyClaimForm()),
    version: 5,
    step: 3,
    description: 'Saved description',
    selectedLines: { 'line-1': 2 },
    isLeftAddress: true,
    isOpenClient: false,
  };
  await configuration.setConfiguration(getSwitchDraftKey('document-1'), draft);
  const restored = await restoreClaimDraft('document-1');
  expect(restored).toMatchObject({
    step: 3,
    isLeftAddress: true,
    isOpenClient: false,
    description: draft.description,
    selectedLines: draft.selectedLines,
  });
  expect(await configuration.getConfigurationKeys()).not.toContain(getSwitchDraftKey('document-1'));
  expect(await restoreClaimDraft('document-1')).toEqual(restored);
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
    step: 2,
    description: '',
    isLeftAddress: null,
    isOpenClient: null,
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
    step: 2,
    description: 'Описание',
    isLeftAddress: null,
    isOpenClient: null,
    attachments: [{ file }],
  });
  expect(
    await configuration.getConfiguration(getDraftKey('document-1'), null, isPersistedClaimDraft),
  ).toMatchObject({ version: 6, attachments: [{ file }] });
  expect(await configuration.getConfigurationKeys()).not.toContain(
    getPreviousDraftKey('document-1'),
  );
});
