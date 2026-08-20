export interface ConfigHelper {
  get(key: string): Promise<unknown | null>;
  getKeys(): Promise<string[]>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
