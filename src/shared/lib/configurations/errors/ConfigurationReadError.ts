export class ConfigurationReadError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: unknown,
  ) {
    super(`Ошибка чтения конфигураций "${key}"`);
    this.name = 'ConfigurationReadError';
  }
}
