import { fireEvent, render, screen } from '@testing-library/react';
import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { AttachmentTypeRow } from './AttachmentTypeRow';

const attachmentType: AttachmentType = {
  order: 10,
  type: 1,
  name: 'Фото товара',
  minAmount: 1,
  mediaType: 'image',
};

test('shows the requirement and adds copied files to its attachment type', () => {
  const onFilesSelected = jest.fn();
  const file = new File(['photo'], 'damage.jpg', { type: 'image/jpeg' });
  render(
    <AttachmentTypeRow
      attachmentType={attachmentType}
      attachments={[]}
      onFilesSelected={onFilesSelected}
      onRemoveAttachment={jest.fn()}
      showErrors
    />,
  );

  expect(screen.getByText('Минимум: 1')).toBeInTheDocument();
  expect(screen.getByText('Добавьте ещё файлов: 1.')).toBeInTheDocument();
  const input = screen.getByLabelText('Добавить файлы: Фото товара');
  expect(input).toHaveAttribute('accept', 'image/*');
  expect(input).toHaveAttribute('multiple');
  const cameraInput = screen.getByLabelText('Сфотографировать: Фото товара');
  expect(cameraInput).toHaveAttribute('accept', 'image/*');
  expect(cameraInput).toHaveAttribute('capture', 'environment');
  expect(cameraInput).not.toHaveAttribute('multiple');

  fireEvent.change(input, { target: { files: [file] } });
  expect(onFilesSelected).toHaveBeenCalledWith(attachmentType, [file]);
});

test('restricts a video type to video files and offers video capture', () => {
  const videoType: AttachmentType = {
    ...attachmentType,
    type: 2,
    name: 'Видео недостатка',
    mediaType: 'video',
  };

  render(
    <AttachmentTypeRow
      attachmentType={videoType}
      attachments={[]}
      onFilesSelected={jest.fn()}
      onRemoveAttachment={jest.fn()}
      showErrors={false}
    />,
  );

  expect(screen.getByLabelText('Добавить файлы: Видео недостатка')).toHaveAttribute(
    'accept',
    'video/*',
  );
  const captureInput = screen.getByLabelText('Записать видео: Видео недостатка');
  expect(captureInput).toHaveAttribute('accept', 'video/*');
  expect(captureInput).toHaveAttribute('capture', 'environment');
});

test('marks a type without a minimum as optional', () => {
  render(
    <AttachmentTypeRow
      attachmentType={{ ...attachmentType, minAmount: 0 }}
      attachments={[]}
      onFilesSelected={jest.fn()}
      onRemoveAttachment={jest.fn()}
      showErrors
    />,
  );

  expect(screen.getByText('Необязательно')).toBeInTheDocument();
  expect(screen.queryByText(/Добавьте ещё/)).not.toBeInTheDocument();
});

test('renders and removes files attached to the row', () => {
  const onRemoveAttachment = jest.fn();
  const attachment: ClaimAttachment = {
    localId: 'attachment-1',
    fileName: 'damage.jpg',
    size: 1024,
    mimeType: 'image/jpeg',
    lastModified: 123,
    attachmentType: attachmentType.type,
    attachmentTypeOrder: attachmentType.order,
    status: 'selected',
  };

  render(
    <AttachmentTypeRow
      attachmentType={attachmentType}
      attachments={[attachment]}
      onFilesSelected={jest.fn()}
      onRemoveAttachment={onRemoveAttachment}
      showErrors
    />,
  );

  expect(screen.getByText('damage.jpg')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Удалить damage.jpg' }));
  expect(onRemoveAttachment).toHaveBeenCalledWith('attachment-1');
});
