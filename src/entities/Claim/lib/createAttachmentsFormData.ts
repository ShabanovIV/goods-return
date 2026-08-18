export const createAttachmentsFormData = (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  return formData;
};
