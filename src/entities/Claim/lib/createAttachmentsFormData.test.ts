import { createAttachmentsFormData } from './createAttachmentsFormData';

test('adds all selected files to one FormData collection', () => {
  const files = [
    new File(['first'], 'first.jpg', { type: 'image/jpeg' }),
    new File(['second'], 'second.mp4', { type: 'video/mp4' }),
  ];

  const formData = createAttachmentsFormData(files);

  expect(formData.getAll('files')).toEqual(files);
});
