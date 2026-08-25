export type GetFlawsQueryParams = { lineIds: string | string[]; reason: string };

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
  products: { id: string; quantity: number }[];
  reason: string;
  flaw: string;
  requirement: string;
  description: string;
  files: File[];
};

export type ClaimErrorResponse = { success: false; error: string };
export type ClaimDataResponse<TData> = { success: true; data: TData } | ClaimErrorResponse;
export type ClaimDictionaryItem = { id: string; name: string };
export type ClaimFlaw = { id: string; name: string };
export type AttachmentMediaType = 'file' | 'image' | 'video';

export type AttachmentType = {
  order: number;
  type: number;
  name: string;
  minAmount: number;
  mediaType?: AttachmentMediaType;
  description?: string;
};

export type GetReasonsResponse = ClaimDataResponse<ClaimDictionaryItem[]>;
export type GetClientDemandsResponse = ClaimDataResponse<ClaimDictionaryItem[]>;
export type GetFlawsResponse = ClaimDataResponse<{ flaws: ClaimFlaw[] }>;
export type GetAttachmentTypesResponse = ClaimDataResponse<AttachmentType[]>;
export type CreateClaimResponse = { id: string; number: string; status: string };
