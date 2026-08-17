import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from 'src/shared/api/baseQuery';
import { toUrlSearchParams } from 'src/shared/api/toUrlSearchParams';
import { DocumentQueryParams, DocumentResponse } from '../types/document';

const BASE_URL = 'document';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery,
  endpoints: (builder) => ({
    getDocument: builder.query<DocumentResponse, DocumentQueryParams>({
      query: (documentQueryParams) => ({
        url: `${BASE_URL}/getdocument`,
        method: 'POST',
        params: toUrlSearchParams(documentQueryParams),
      }),
    }),
  }),
});

export const { useGetDocumentQuery, useLazyGetDocumentQuery } = documentApi;
