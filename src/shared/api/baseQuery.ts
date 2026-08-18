import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: __API_URL__,
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (__DEVELOPMENT_TOKEN__) {
      headers.set('Authorization', __DEVELOPMENT_TOKEN__);
    }

    return headers;
  },
});

type BusinessError = {
  success: false;
  error: string;
};

const isBusinessError = (value: unknown): value is BusinessError => {
  if (typeof value !== 'object' || value === null) return false;

  const response = value as Record<string, unknown>;
  return response.success === false && typeof response.error === 'string';
};

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if ('data' in result && isBusinessError(result.data)) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: result.data.error || 'Операция не выполнена.',
        data: result.data,
      },
    };
  }

  return result;
};
