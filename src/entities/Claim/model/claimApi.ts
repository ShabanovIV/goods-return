import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from 'src/shared/api/baseQuery';
import { toUrlSearchParams } from 'src/shared/api/toUrlSearchParams';
import type {
  AddAttachmentQueryParams,
  AddAttachmentResponse,
  GetAttachmentTypesResponse,
  GetClientDemandsResponse,
  GetFlawsQueryParams,
  GetFlawsResponse,
  GetReasonsResponse,
} from '../types/claim';

const BASE_URL = 'claim';

export const claimApi = createApi({
  reducerPath: 'claimApi',
  baseQuery,
  endpoints: (builder) => ({
    getReasons: builder.query<GetReasonsResponse, void>({
      query: () => ({
        url: `${BASE_URL}/getreasons`,
        method: 'POST',
      }),
    }),
    getClientDemands: builder.query<GetClientDemandsResponse, void>({
      query: () => ({
        url: `${BASE_URL}/getClientDemands`,
        method: 'POST',
      }),
    }),
    getFlaws: builder.query<GetFlawsResponse, GetFlawsQueryParams>({
      query: (params) => ({
        url: `${BASE_URL}/getFlaws`,
        method: 'POST',
        params: toUrlSearchParams(params),
      }),
    }),
    addAttachment: builder.mutation<AddAttachmentResponse, AddAttachmentQueryParams>({
      query: ({ documentId, file }) => {
        const body = new FormData();
        body.append('file', file);

        return {
          url: `${BASE_URL}/addAttachment`,
          method: 'POST',
          params: toUrlSearchParams({ documentId }),
          body,
        };
      },
    }),
    getAttachmentTypes: builder.query<GetAttachmentTypesResponse, void>({
      query: () => ({
        url: `${BASE_URL}/getAttachmentTypes`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useAddAttachmentMutation,
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
  useLazyGetAttachmentTypesQuery,
  useLazyGetClientDemandsQuery,
  useLazyGetFlawsQuery,
  useLazyGetReasonsQuery,
} = claimApi;
