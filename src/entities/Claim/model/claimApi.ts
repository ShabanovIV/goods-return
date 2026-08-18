import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from 'src/shared/api/baseQuery';
import { toUrlSearchParams } from 'src/shared/api/toUrlSearchParams';
import { createAttachmentsFormData } from '../lib/createAttachmentsFormData';
import type {
  AddAttachmentsQueryParams,
  AddAttachmentsResponse,
  CreateClaimQueryParams,
  CreateClaimResponse,
  GetAttachmentTypesResponse,
  GetClientDemandsResponse,
  GetFlawsQueryParams,
  GetFlawsResponse,
  GetReasonsResponse,
} from '../types/claim';

const BASE_URL = 'claim';

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

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
    addAttachments: builder.mutation<AddAttachmentsResponse, AddAttachmentsQueryParams>({
      query: ({ documentId, files }) => ({
        url: `${BASE_URL}/addAttachment`,
        method: 'POST',
        params: toUrlSearchParams({ documentId }),
        body: createAttachmentsFormData(files),
      }),
    }),
    getAttachmentTypes: builder.query<GetAttachmentTypesResponse, void>({
      query: () => ({
        url: `${BASE_URL}/getAttachmentTypes`,
        method: 'POST',
      }),
    }),
    createClaim: builder.mutation<CreateClaimResponse, CreateClaimQueryParams>({
      queryFn: async () => {
        await wait(700);
        const claimId = crypto.randomUUID?.() ?? `claim-${Date.now()}`;

        return {
          data: {
            success: true,
            data: {
              claimId,
              claimNumber: `GR-${Date.now().toString().slice(-8)}`,
            },
          },
        };
      },
    }),
  }),
});

export const {
  useAddAttachmentsMutation,
  useCreateClaimMutation,
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
  useLazyGetAttachmentTypesQuery,
  useLazyGetClientDemandsQuery,
  useLazyGetFlawsQuery,
  useLazyGetReasonsQuery,
} = claimApi;
