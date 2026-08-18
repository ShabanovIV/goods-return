export class ConfigurationSerializationError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: unknown,
  ) {
    super(`Ошибка сериализации конфигураций "${key}"`);
    this.name = 'ConfigurationSerializationError';
  }
}
