import { deserializeConfiguration } from '../lib/deserializeConfiguration';
import { serializeConfiguration } from '../lib/serializeConfiguration';
import { ConfigHelper } from '../types/config';

export const localStorageConfigHelper: ConfigHelper = {
  async get(key: string): Promise<unknown | null> {
    const value = localStorage.getItem(key);
    return value === null ? null : deserializeConfiguration(key, value);
  },
  async getKeys(): Promise<string[]> {
    return Object.keys(localStorage);
  },
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, serializeConfiguration(key, value));
  },
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};
