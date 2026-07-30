export const getRequestErrorMessage = (error: unknown) => {
  console.log(error);

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const requestError = error as { status: unknown; error?: string; data?: unknown };

    if (typeof requestError.data === 'string' && requestError.data) {
      return requestError.data;
    }

    return requestError.error ?? `Запрос завершился с ошибкой ${String(requestError.status)}`;
  }

  return 'Не удалось выполнить запрос.';
};

export const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const formatResponse = (response: string) => {
  try {
    return JSON.stringify(JSON.parse(response), null, 2);
  } catch {
    return response;
  }
};
