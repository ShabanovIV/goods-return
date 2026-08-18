export type GetFlawsQueryParams = { lineIds: string | string[]; reason: string };
export type AddAttachmentsQueryParams = { documentId: string; files: File[] };

export type ClaimAttachmentMetadata = {
  localId: string;
  fileName: string;
  size: number;
  mimeType: string;
  attachmentType?: number;
  attachmentTypeOrder?: number;
  attachmentTypeName?: string;
};

export type AttachmentStatus = 'selected' | 'uploaded';
export type ClaimAttachment = ClaimAttachmentMetadata & {
  lastModified: number;
  status: AttachmentStatus;
  file?: File;
};

export type CreateClaimQueryParams = {
  documentId: string;
  lines: { lineId: string; amount: number }[];
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  attachments: ClaimAttachmentMetadata[];
};

export type ClaimErrorResponse = { success: false; error: string };
export type ClaimDataResponse<TData> = { success: true; data: TData } | ClaimErrorResponse;
export type ClaimActionResponse = { success: true } | ClaimErrorResponse;
export type ClaimDictionaryItem = { id: string; name: string };
export type ClaimFlaw = { id: string; name: string };

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
export type AddAttachmentsResponse = ClaimActionResponse;
export type GetAttachmentTypesResponse = ClaimDataResponse<AttachmentType[]>;
export type CreateClaimResponse = ClaimDataResponse<{ claimId: string; claimNumber: string }>;
