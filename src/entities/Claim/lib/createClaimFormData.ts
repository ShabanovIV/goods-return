import type { CreateClaimQueryParams } from '../types/claim';

export const createClaimFormData = ({
  description,
  documentId,
  files,
  flaw,
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
  formData.append('IsLeftAddress', 'true');
  formData.append('IsOpenClient', 'false');
  files.forEach((file) => formData.append('', file, file.name));

  return formData;
};
