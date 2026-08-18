import { ConfigurationSerializationError } from '../errors/ConfigurationSerializationError';

export const serializeConfiguration = <T>(key: string, value: T): string => {
  try {
    const serializedValue = JSON.stringify(value);

    // JSON.stringify не всегда выбрасывает ошибку:
    // для undefined, function и Symbol он возвращает undefined
    if (serializedValue === undefined) {
      throw new TypeError('Configuration is not JSON-serializable');
    }

    return serializedValue;
  } catch (error: unknown) {
    throw new ConfigurationSerializationError(key, error);
  }
};
