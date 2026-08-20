import { ConfigurationWriteError } from '../errors/ConfigurationWriteError';
import { ConfigHelper } from '../types/config';

export const writeConfiguration = async <T>(
  key: string,
  value: T,
  configHelper: ConfigHelper,
): Promise<void> => {
  try {
    await configHelper.set(key, value);
  } catch (error: unknown) {
    throw new ConfigurationWriteError(key, error);
  }
};
