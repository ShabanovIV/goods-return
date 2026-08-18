import { claimApi } from 'src/entities/Claim';
import type {
  AddAttachmentsQueryParams,
  AddAttachmentsResponse,
  CreateClaimQueryParams,
  CreateClaimResponse,
} from 'src/entities/Claim';
import { toUrlSearchParams } from 'src/shared/api';
import { createAttachmentsFormData } from '../lib/createAttachmentsFormData';

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const submitClaimApi = claimApi.injectEndpoints({
  endpoints: (builder) => ({
    addAttachments: builder.mutation<AddAttachmentsResponse, AddAttachmentsQueryParams>({
      query: ({ documentId, files }) => ({
        url: 'claim/addAttachment',
        method: 'POST',
        params: toUrlSearchParams({ documentId }),
        body: createAttachmentsFormData(files),
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

export const { useAddAttachmentsMutation, useCreateClaimMutation } = submitClaimApi;
