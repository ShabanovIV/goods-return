import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ClaimOptions } from './ClaimOptions';

const TestOptions = () => {
  const [isLeftAddress, onLeftAddressChange] = useState<boolean | null>(null);
  const [isOpenClient, onOpenClientChange] = useState<boolean | null>(null);
  return (
    <ClaimOptions
      {...{ isLeftAddress, isOpenClient, onLeftAddressChange, onOpenClientChange }}
      showErrors
    />
  );
};

test('requires an explicit answer and supports clearing it again', () => {
  render(<TestOptions />);
  const fields = screen.getAllByRole('combobox');
  expect(screen.getAllByText('Выберите «Да» или «Нет».')).toHaveLength(2);
  fields.forEach((field, index) => {
    expect(field).toHaveTextContent('Не выбрано');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(field);
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(3);
    fireEvent.click(screen.getByRole('option', { name: index === 0 ? 'Нет' : 'Да' }));
    expect(field).toHaveTextContent(index === 0 ? 'Нет' : 'Да');
    expect(field).toHaveAttribute('aria-invalid', 'false');
  });
  expect(screen.queryByText('Выберите «Да» или «Нет».')).not.toBeInTheDocument();
  fireEvent.click(fields[0]);
  fireEvent.click(screen.getByRole('option', { name: 'Не выбрано' }));
  expect(fields[0]).toHaveAttribute('aria-invalid', 'true');
});
