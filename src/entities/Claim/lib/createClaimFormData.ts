import type { CreateClaimQueryParams } from '../types/claim';

export const createClaimFormData = ({
  description,
  documentId,
  files,
  flaw,
  isLeftAddress,
  isOpenClient,
  products,
  reason,
  requirement,
}: CreateClaimQueryParams) => {
  const formData = new FormData();

  formData.append('DocumentId', documentId);
  products.forEach((product, index) => {
    formData.append(`Products[${index}][Id]`, product.id);
    formData.append(`Products[${index}][Quantity]`, product.quantity.toString());
  });
  formData.append('Reason', reason);
  formData.append('Flaw', flaw);
  formData.append('Requirement', requirement);
  formData.append('Description', description.trim());
  formData.append('IsLeftAddress', isLeftAddress.toString());
  formData.append('IsOpenClient', isOpenClient.toString());
  files.forEach((file) => formData.append('', file, file.name));

  return formData;
};
