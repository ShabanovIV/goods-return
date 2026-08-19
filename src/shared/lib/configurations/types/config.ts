export interface ConfigHelper {
  get(key: string): Promise<string | null>;
  getKeys(): Promise<string[]>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
