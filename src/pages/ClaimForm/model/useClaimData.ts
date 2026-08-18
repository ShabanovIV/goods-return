import { useMemo } from 'react';
import {
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
} from 'src/entities/Claim';
import { useGetDocumentQuery } from 'src/entities/Document';
import type { ClaimFormState } from './claimFormTypes';

export const useClaimData = (documentId: string, formState: ClaimFormState) => {
  const documentQuery = useGetDocumentQuery({ documentId }, { skip: !documentId });
  const reasonsQuery = useGetReasonsQuery(undefined, { skip: !documentId });
  const demandsQuery = useGetClientDemandsQuery(undefined, { skip: !documentId });
  const attachmentTypesQuery = useGetAttachmentTypesQuery(undefined, { skip: !documentId });
  const selectedLineIds = useMemo(
    () => Object.keys(formState.selectedLines),
    [formState.selectedLines],
  );
  const flawsQuery = useGetFlawsQuery(
    { lineIds: selectedLineIds, reason: formState.reasonId },
    { skip: selectedLineIds.length === 0 || !formState.reasonId },
  );

  const products = useMemo(() => {
    if (!documentQuery.data?.success) return [];
    const productLines = documentQuery.data.data.details.filter((detail) => detail.isProduct);
    return productLines.length ? productLines : documentQuery.data.data.details;
  }, [documentQuery.data]);
  const reasons = reasonsQuery.data?.success ? reasonsQuery.data.data : [];
  const demands = demandsQuery.data?.success ? demandsQuery.data.data : [];
  const flaws = useMemo(
    () => (flawsQuery.data?.success ? flawsQuery.data.data.flaws : []),
    [flawsQuery.data],
  );
  const attachmentTypes = useMemo(
    () =>
      attachmentTypesQuery.data?.success
        ? [...attachmentTypesQuery.data.data].sort((left, right) => left.order - right.order)
        : [],
    [attachmentTypesQuery.data],
  );

  const areDetailsReady = !(
    reasonsQuery.isFetching ||
    demandsQuery.isFetching ||
    flawsQuery.isFetching ||
    reasonsQuery.error ||
    demandsQuery.error ||
    flawsQuery.error
  );
  const areAttachmentTypesReady = !(attachmentTypesQuery.error || attachmentTypesQuery.isFetching);

  return {
    areAttachmentTypesReady,
    areDetailsReady,
    attachmentTypes,
    attachmentTypesQuery,
    demands,
    demandsQuery,
    documentQuery,
    flaws,
    flawsQuery,
    products,
    reasons,
    reasonsQuery,
    selectedLineIds,
  };
};
