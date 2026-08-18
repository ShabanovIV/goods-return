export class ConfigurationWriteError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: unknown,
  ) {
    super(`Ошибка записи конфигураций "${key}"`);
    this.name = 'ConfigurationWriteError';
  }
}
