import type { ErrorNotice } from 'src/shared/ui/ErrorMessage';

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);
const describe = (value: unknown): string => {
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2) || '';
  } catch {
    return String(value);
  }
};

export const getRequestErrorMessage = (error: unknown): ErrorNotice => {
  const request = asRecord(error);
  const data = asRecord(request.data);
  const apiResponse =
    (data.success ?? data.Success) === false ||
    (typeof data.code === 'string' &&
      typeof data.reason === 'string' &&
      typeof data.message === 'string');
  const originalMessage =
    text(data.message) ||
    text(data.Message) ||
    text(data.error) ||
    text(data.Error) ||
    text(request.data) ||
    text(request.error) ||
    text(request.message) ||
    text(error);
  const technical =
    request.status === 'FETCH_ERROR' ||
    request.status === 'TIMEOUT_ERROR' ||
    request.status === 'PARSING_ERROR' ||
    Boolean(originalMessage && /<\/?[a-z][\s\S]*>/i.test(originalMessage));
  const status = request.originalStatus ?? request.status;
  const details = [
    status !== undefined ? 'Статус: ' + String(status) : '',
    request.data !== undefined ? 'Ответ:\n' + describe(request.data) : '',
    request.error !== undefined ? 'Ошибка: ' + describe(request.error) : '',
    error instanceof Error ? describe(error) : '',
    typeof error === 'string' ? error : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  return {
    source: apiResponse ? 'api' : 'request',
    message:
      request.status === 'TIMEOUT_ERROR'
        ? 'Время ожидания ответа сервера истекло. Исходная ошибка доступна в подробностях.'
        : technical
          ? 'Не удалось получить корректный ответ сервера. Исходная ошибка доступна в подробностях.'
          : originalMessage || 'Не удалось выполнить запрос.',
    details: details || undefined,
  };
};
