import { ConfigurationDeserializationError } from '../errors/ConfigurationDeserializationError';

export const deserializeConfiguration = (key: string, serializedValue: string): unknown => {
  try {
    return JSON.parse(serializedValue);
  } catch (error: unknown) {
    throw new ConfigurationDeserializationError(key, error);
  }
};
