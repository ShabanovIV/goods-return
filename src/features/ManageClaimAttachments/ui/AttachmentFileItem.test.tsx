import { render, screen } from '@testing-library/react';
import { AttachmentFileItem } from './AttachmentFileItem';

test('shows a read failure beside the file with its original diagnostic', () => {
  render(
    <AttachmentFileItem
      attachment={{
        localId: 'bad-file',
        fileName: 'photo.jpg',
        size: 10,
        mimeType: 'image/jpeg',
        lastModified: 1,
        status: 'error',
        errorReason: 'read',
        errorDetails: 'NotReadableError: File changed',
      }}
      onRemove={jest.fn()}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Не удалось прочитать файл. Удалите его и добавьте заново.',
  );
  expect(screen.getByText('NotReadableError: File changed')).toBeInTheDocument();
  expect(screen.queryByText(/Не удалось преобразовать/)).not.toBeInTheDocument();
});
