export class ConfigurationDeserializationError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: unknown,
  ) {
    super(`Ошибка десериализации конфигураций "${key}"`);
    this.name = 'ConfigurationDeserializationError';
  }
}
