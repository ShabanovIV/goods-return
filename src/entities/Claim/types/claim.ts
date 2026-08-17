export type GetFlawsQueryParams = {
  lineIds: string | string[];
  reason: string;
};

export type AddAttachmentQueryParams = {
  documentId: string;
  file: File;
};

export type ClaimErrorResponse = {
  success: false;
  error: string;
};

export type ClaimDataResponse<TData> =
  | {
      success: true;
      data: TData;
    }
  | ClaimErrorResponse;

export type ClaimActionResponse = { success: true } | ClaimErrorResponse;

export type ClaimDictionaryItem = {
  id: string;
  name: string;
};

export type ClaimFlaw = {
  id: string;
  name: string;
};

export type AttachmentType = {
  order: number;
  type: number;
  name: string;
  minAmount: number;
  description?: string;
};

export type GetReasonsResponse = ClaimDataResponse<ClaimDictionaryItem[]>;
export type GetClientDemandsResponse = ClaimDataResponse<ClaimDictionaryItem[]>;
export type GetFlawsResponse = ClaimDataResponse<{ flaws: ClaimFlaw[] }>;
export type AddAttachmentResponse = ClaimActionResponse;
export type GetAttachmentTypesResponse = ClaimDataResponse<AttachmentType[]>;
