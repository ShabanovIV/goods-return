import { type ClaimAttachment, useCreateClaimMutation } from 'src/entities/Claim';

type SubmitClaimArguments = {
  documentId: string;
  selectedLines: Record<string, number>;
  reasonId: string;
  clientDemandId: string;
  flawId: string;
  description: string;
  isLeftAddress: boolean;
  isOpenClient: boolean;
  attachments: ClaimAttachment[];
};

export const useSubmitClaim = () => {
  const [createClaim, createClaimState] = useCreateClaimMutation();

  const submitClaim = async ({
    documentId,
    selectedLines,
    reasonId,
    clientDemandId,
    flawId,
    description,
    isLeftAddress,
    isOpenClient,
    attachments,
  }: SubmitClaimArguments) => {
    const files = attachments.flatMap((attachment) => (attachment.file ? [attachment.file] : []));

    const response = await createClaim({
      documentId,
      products: Object.entries(selectedLines).map(([id, quantity]) => ({ id, quantity })),
      reason: reasonId,
      flaw: flawId,
      requirement: clientDemandId,
      description,
      isLeftAddress,
      isOpenClient,
      files,
    }).unwrap();

    if (!response.number) throw new Error('Сервер не вернул номер созданной претензии.');

    return response.number;
  };

  return {
    isCreatingClaim: createClaimState.isLoading,
    submitClaim,
  };
};
