import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, toUrlSearchParams } from 'src/shared/api';
import type { DocumentQueryParams, DocumentResponse } from '../types/document';

const BASE_URL = 'document';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery,
  endpoints: (builder) => ({
    getDocument: builder.query<DocumentResponse, DocumentQueryParams>({
      query: (params) => ({
        url: `${BASE_URL}/getdocument`,
        method: 'POST',
        params: toUrlSearchParams(params),
      }),
    }),
  }),
});

export const { useGetDocumentQuery, useLazyGetDocumentQuery } = documentApi;
