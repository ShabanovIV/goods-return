import { ConfigurationReadError } from '../errors/ConfigurationReadError';
import { ConfigHelper } from '../types/config';

export const readConfiguration = async (
  key: string,
  configHelper: ConfigHelper,
): Promise<unknown | null> => {
  try {
    return await configHelper.get(key);
  } catch (error: unknown) {
    throw new ConfigurationReadError(key, error);
  }
};
