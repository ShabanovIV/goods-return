import { useMemo } from 'react';
import {
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
} from 'src/entities/Claim';
import { useGetDocumentQuery } from 'src/entities/Document';
import type { ClaimFormState } from '../types/claimForm';

export const useClaimData = (documentId: string, formState: ClaimFormState) => {
  const documentQuery = useGetDocumentQuery({ documentId }, { skip: !documentId });
  const reasonsQuery = useGetReasonsQuery(undefined, { skip: !documentId });
  const demandsQuery = useGetClientDemandsQuery(undefined, { skip: !documentId });
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
    return documentQuery.data.data.details;
  }, [documentQuery.data]);
  const productIds = [
    ...new Set(
      selectedLineIds
        .map((lineId) => products.find((product) => product.lineId === lineId)?.productId)
        .filter((id): id is string => Boolean(id)),
    ),
  ].sort();
  const hasSelectedProducts =
    selectedLineIds.length > 0 &&
    selectedLineIds.every((lineId) =>
      products.some((product) => product.lineId === lineId && product.productId),
    );
  const attachmentTypesQuery = useGetAttachmentTypesQuery(
    { productIds },
    { skip: !documentId || !hasSelectedProducts },
  );
  const reasons = reasonsQuery.data?.success ? reasonsQuery.data.data : [];
  const demands = demandsQuery.data?.success ? demandsQuery.data.data : [];
  const flaws = useMemo(
    () => (flawsQuery.data?.success ? flawsQuery.data.data.flaws : []),
    [flawsQuery.data],
  );
  const attachmentTypes = useMemo(
    () =>
      attachmentTypesQuery.currentData?.success
        ? [...attachmentTypesQuery.currentData.data].sort((left, right) => left.order - right.order)
        : [],
    [attachmentTypesQuery.currentData],
  );

  const areDetailsReady = !(
    reasonsQuery.isFetching ||
    demandsQuery.isFetching ||
    flawsQuery.isFetching ||
    reasonsQuery.error ||
    demandsQuery.error ||
    flawsQuery.error
  );
  const areAttachmentTypesReady = Boolean(
    hasSelectedProducts &&
    attachmentTypesQuery.currentData?.success &&
    !attachmentTypesQuery.error &&
    !attachmentTypesQuery.isFetching,
  );

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
