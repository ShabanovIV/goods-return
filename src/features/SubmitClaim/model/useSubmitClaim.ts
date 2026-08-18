import type { ClaimAttachment } from 'src/entities/Claim';
import { useAddAttachmentsMutation, useCreateClaimMutation } from '../api/submitClaimApi';

type SubmitClaimArguments = {
  documentId: string;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawIds: string[];
  attachments: ClaimAttachment[];
  onAttachmentsUploaded: () => void;
};

export const useSubmitClaim = () => {
  const [addAttachments, addAttachmentsState] = useAddAttachmentsMutation();
  const [createClaim, createClaimState] = useCreateClaimMutation();

  const submitClaim = async ({
    documentId,
    selectedLines,
    reasonId,
    clientDemandId,
    flawIds,
    attachments,
    onAttachmentsUploaded,
  }: SubmitClaimArguments) => {
    const files = attachments.flatMap((attachment) =>
      attachment.status === 'selected' && attachment.file ? [attachment.file] : [],
    );

    if (files.length) {
      const attachmentResponse = await addAttachments({ documentId, files }).unwrap();
      if (!attachmentResponse.success) throw new Error(attachmentResponse.error);
      onAttachmentsUploaded();
    }

    const response = await createClaim({
      documentId,
      lines: Object.entries(selectedLines).map(([lineId, amount]) => ({ lineId, amount })),
      reasonId,
      clientDemandId,
      flawIds,
      attachments: attachments
        .filter((attachment) => attachment.status !== 'needs-file')
        .map(({ lastModified: _lastModified, status: _status, file: _file, ...item }) => item),
    }).unwrap();
    if (!response.success) throw new Error(response.error);

    return response.data.claimNumber;
  };

  return {
    isCreatingClaim: createClaimState.isLoading,
    isUploadingAttachments: addAttachmentsState.isLoading,
    submitClaim,
  };
};
