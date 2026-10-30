import { claimApi } from './claimApi';
import { createClaimFormData } from '../lib/createClaimFormData';
import type { CreateClaimQueryParams, CreateClaimResponse } from '../types/claim';

const submitClaimApi = claimApi.injectEndpoints({
  endpoints: (builder) => ({
    createClaim: builder.mutation<CreateClaimResponse, CreateClaimQueryParams>({
      query: (params) => ({
        url: 'claim/create',
        method: 'POST',
        timeout: __CLAIM_CREATE_TIMEOUT_MS__,
        body: createClaimFormData(params),
      }),
    }),
  }),
});

export const { useCreateClaimMutation } = submitClaimApi;
