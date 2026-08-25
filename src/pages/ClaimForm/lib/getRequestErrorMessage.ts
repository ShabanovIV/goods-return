export const getRequestErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error !== 'object' || error === null) {
    return 'Не удалось выполнить запрос. Проверьте соединение и попробуйте ещё раз.';
  }

  const requestError = error as { data?: unknown; error?: unknown; status?: unknown };

  if (typeof requestError.data === 'object' && requestError.data !== null) {
    const data = requestError.data as Record<string, unknown>;
    if (typeof data.message === 'string' && data.message) return data.message;
    if (typeof data.Message === 'string' && data.Message) return data.Message;
    if (typeof data.error === 'string' && data.error) return data.error;
    if (typeof data.Error === 'string' && data.Error) return data.Error;
  }

  if (typeof requestError.data === 'string' && requestError.data) return requestError.data;
  if (typeof requestError.error === 'string' && requestError.error) return requestError.error;

  return 'Не удалось выполнить запрос. Проверьте соединение и попробуйте ещё раз.';
};
