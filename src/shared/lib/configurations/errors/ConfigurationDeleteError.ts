export class ConfigurationDeleteError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: unknown,
  ) {
    super(`Не удалось удалить конфигурацию с ключом "${key}".`);
    this.name = 'ConfigurationDeleteError';
  }
}
