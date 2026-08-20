import { deleteConfiguration } from '../lib/deleteConfiguration';
import { readConfiguration } from '../lib/readConfiguration';
import { writeConfiguration } from '../lib/writeConfiguration';
import { indexedDbConfigHelper } from '../storages/indexedDbConfigurationStorage';

type ConfigHelperFactory = {
  getConfiguration<T>(
    key: string,
    defaultValue: T,
    validate: (value: unknown) => value is T,
  ): Promise<T>;
  getConfigurationKeys(): Promise<string[]>;
  setConfiguration<T>(key: string, value: T): Promise<void>;
  removeConfiguration(key: string): Promise<void>;
};

export const configHelperFactory = (): ConfigHelperFactory => {
  const configHelper = indexedDbConfigHelper;

  const getConfiguration = async <T>(
    key: string,
    defaultValue: T,
    validate: (value: unknown) => value is T,
  ): Promise<T> => {
    const value = await readConfiguration(key, configHelper);

    if (value === null) {
      return defaultValue;
    }

    return validate(value) ? value : defaultValue;
  };

  const setConfiguration = async <T>(key: string, value: T): Promise<void> => {
    await writeConfiguration(key, value, configHelper);
  };

  const getConfigurationKeys = async (): Promise<string[]> => configHelper.getKeys();

  const removeConfiguration = async (key: string): Promise<void> => {
    await deleteConfiguration(key, configHelper);
  };

  return {
    getConfiguration,
    getConfigurationKeys,
    removeConfiguration,
    setConfiguration,
  };
};
