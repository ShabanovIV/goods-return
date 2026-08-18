import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, toUrlSearchParams } from 'src/shared/api';
import type {
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
      query: () => ({ url: `${BASE_URL}/getreasons`, method: 'POST' }),
    }),
    getClientDemands: builder.query<GetClientDemandsResponse, void>({
      query: () => ({ url: `${BASE_URL}/getClientDemands`, method: 'POST' }),
    }),
    getFlaws: builder.query<GetFlawsResponse, GetFlawsQueryParams>({
      query: (params) => ({
        url: `${BASE_URL}/getFlaws`,
        method: 'POST',
        params: toUrlSearchParams(params),
      }),
    }),
    getAttachmentTypes: builder.query<GetAttachmentTypesResponse, void>({
      query: () => ({ url: `${BASE_URL}/getAttachmentTypes`, method: 'POST' }),
    }),
  }),
});

export const {
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
  useLazyGetAttachmentTypesQuery,
  useLazyGetClientDemandsQuery,
  useLazyGetFlawsQuery,
  useLazyGetReasonsQuery,
} = claimApi;
