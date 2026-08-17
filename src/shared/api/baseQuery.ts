import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
  baseUrl: __API_URL__,
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (__DEVELOPMENT_TOKEN__) {
      headers.set('Authorization', __DEVELOPMENT_TOKEN__);
    }

    return headers;
  },
});
