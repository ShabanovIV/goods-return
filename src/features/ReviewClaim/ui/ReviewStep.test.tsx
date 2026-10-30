import { fireEvent, render, screen, within } from '@testing-library/react';
import { ReviewStep } from './ReviewStep';

test('edits claim options through the details section', () => {
  const onEdit = jest.fn();
  render(
    <ReviewStep
      products={[]}
      selectedLines={{}}
      description="Описание"
      isLeftAddress={false}
      isOpenClient={false}
      attachments={[]}
      onEdit={onEdit}
    />,
  );
  const card = screen.getByText('Товар оставлен на адресе').closest('section');
  expect(card).not.toBeNull();
  if (!card) throw new Error('Review section not found');
  expect(within(card).getByRole('heading', { name: 'Обращение' })).toBeInTheDocument();
  fireEvent.click(within(card).getByRole('button', { name: 'Изменить' }));
  expect(onEdit).toHaveBeenCalledWith('details');
});

test('shows the combined attachment size and configured maximum before submission', () => {
  render(
    <ReviewStep
      products={[]}
      selectedLines={{}}
      description="Описание"
      isLeftAddress={false}
      isOpenClient={false}
      onEdit={jest.fn()}
      attachments={[
        {
          localId: 'a',
          fileName: 'a.jpg',
          size: 1024 * 1024,
          mimeType: 'image/jpeg',
          lastModified: 1,
          status: 'selected',
        },
        {
          localId: 'b',
          fileName: 'b.jpg',
          size: 1024 * 1024,
          mimeType: 'image/jpeg',
          lastModified: 1,
          status: 'selected',
        },
      ]}
    />,
  );
  expect(screen.getByText('Общий размер вложений: 2 МБ из 100 МБ')).toBeInTheDocument();
});
