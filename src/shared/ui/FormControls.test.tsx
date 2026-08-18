import { fireEvent, render, screen } from '@testing-library/react';
import { Alert } from './Alert';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { FormField } from './FormField';
import { IconButton } from './IconButton';
import { Select } from './Select';

test('connects a form field label, select and error', () => {
  render(
    <FormField error="Выберите значение" htmlFor="reason" label="Причина">
      <Select id="reason" aria-describedby="reason-error">
        <option value="">Не выбрано</option>
      </Select>
    </FormField>,
  );

  expect(screen.getByLabelText('Причина')).toHaveAttribute('aria-describedby', 'reason-error');
  expect(screen.getByText('Выберите значение')).toHaveAttribute('id', 'reason-error');
});

test('forwards checkbox state and change handler', () => {
  const onChange = jest.fn();
  render(
    <label>
      <Checkbox checked={false} onChange={onChange} />
      Согласен
    </label>,
  );

  fireEvent.click(screen.getByRole('checkbox', { name: 'Согласен' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('renders reusable alert actions', () => {
  const onClose = jest.fn();
  render(
    <Alert
      action={
        <IconButton aria-label="Закрыть" onClick={onClose}>
          ×
        </IconButton>
      }
    >
      Ошибка
    </Alert>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('alert')).toHaveTextContent('Ошибка');
});

test('uses button type button by default', () => {
  render(<Button>Продолжить</Button>);
  expect(screen.getByRole('button', { name: 'Продолжить' })).toHaveAttribute('type', 'button');
});
