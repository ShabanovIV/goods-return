import { fireEvent, render, screen } from '@testing-library/react';
import { ClaimDescriptionField } from './ClaimDescriptionField';

test('requires a claim description and limits it to 1000 characters', () => {
  const onChange = jest.fn();
  const { rerender } = render(
    <ClaimDescriptionField description="" onChange={onChange} showErrors />,
  );

  const textarea = screen.getByLabelText('Суть претензии');
  expect(textarea).toHaveAttribute('maxlength', '1000');
  expect(textarea).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Опишите суть претензии.')).toBeInTheDocument();

  fireEvent.change(textarea, { target: { value: 'Повреждение товара' } });
  expect(onChange).toHaveBeenCalledWith('Повреждение товара');

  rerender(
    <ClaimDescriptionField description="Повреждение товара" onChange={onChange} showErrors />,
  );
  expect(screen.getByLabelText('Суть претензии')).toHaveAttribute('aria-invalid', 'false');

  rerender(<ClaimDescriptionField description={'а'.repeat(1001)} onChange={onChange} showErrors />);
  expect(
    screen.getByText('Суть претензии должна быть не длиннее 1000 символов.'),
  ).toBeInTheDocument();
});
