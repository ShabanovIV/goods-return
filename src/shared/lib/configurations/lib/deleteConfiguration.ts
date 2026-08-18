import { ConfigurationDeleteError } from '../errors/ConfigurationDeleteError';
import { ConfigHelper } from '../types/config';

export const deleteConfiguration = async (
  key: string,
  configHelper: ConfigHelper,
): Promise<void> => {
  try {
    await configHelper.remove(key);
  } catch (error: unknown) {
    throw new ConfigurationDeleteError(key, error);
  }
};
