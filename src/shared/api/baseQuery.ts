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

export const getBusinessErrorMessage = (value: unknown) => {
  if (typeof value !== 'object' || value === null) return undefined;

  const response = value as Record<string, unknown>;
  const success = response.success ?? response.Success;
  if (success !== false) return undefined;

  const error = response.error ?? response.Error;
  return typeof error === 'string' && error ? error : 'Операция не выполнена.';
};

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const businessError = 'data' in result ? getBusinessErrorMessage(result.data) : undefined;
  if (businessError) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: businessError,
        data: result.data,
      },
    };
  }

  return result;
};
