import { deserializeConfiguration } from '../lib/deserializeConfiguration';
import { readConfiguration } from '../lib/readConfiguration';
import { serializeConfiguration } from '../lib/serializeConfiguration';
import { writeConfiguration } from '../lib/writeConfiguration';
import { localStorageConfigHelper } from '../storages/localConfigurationStorage';

type ConfigHelperFactory = {
  getConfiguration<T>(
    key: string,
    defaultValue: T,
    validate: (value: unknown) => value is T,
  ): Promise<T>;
  setConfiguration<T>(key: string, value: T): Promise<void>;
};

export const configHelperFactory = (): ConfigHelperFactory => {
  // Здесь можно выбрать другой источник хранения конфигурации, например, sessionStorageConfigHelper или remoteConfigHelper, если они будут реализованы в будущем.
  const configHelper = localStorageConfigHelper;

  // Получение конфигурации с десериализацией значения из JSON и проверкой типа
  const getConfiguration = async <T>(
    key: string,
    defaultValue: T,
    validate: (value: unknown) => value is T,
  ): Promise<T> => {
    const serializedValue = await readConfiguration(key, configHelper);

    if (serializedValue === null) {
      return defaultValue;
    }

    const value = deserializeConfiguration(key, serializedValue);

    return validate(value) ? value : defaultValue;
  };

  // Установка конфигурации с сериализацией значения в JSON перед сохранением
  const setConfiguration = async <T>(key: string, value: T): Promise<void> => {
    const serializedValue = serializeConfiguration(key, value);
    await writeConfiguration(key, serializedValue, configHelper);
  };

  return {
    getConfiguration,
    setConfiguration,
  };
};
