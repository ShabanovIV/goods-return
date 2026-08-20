import { configHelperFactory } from './configHelperFactory';

const configuration = configHelperFactory();

afterEach(async () => {
  const keys = await configuration.getConfigurationKeys();
  await Promise.all(keys.map((key) => configuration.removeConfiguration(key)));
});

test('stores structured values including files', async () => {
  const file = new File(['photo'], 'damage.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });
  const value = { documentId: 'document-1', file };
  const isStoredValue = (candidate: unknown): candidate is typeof value =>
    typeof candidate === 'object' &&
    candidate !== null &&
    'documentId' in candidate &&
    candidate.documentId === 'document-1' &&
    'file' in candidate &&
    candidate.file instanceof File;

  await configuration.setConfiguration('draft', value);

  const restored = await configuration.getConfiguration('draft', null, isStoredValue);
  expect(restored?.file).toBeInstanceOf(File);
  expect(restored?.file.name).toBe('damage.jpg');
  expect(restored?.file.size).toBe(file.size);
  expect(restored?.file.type).toBe('image/jpeg');
});
