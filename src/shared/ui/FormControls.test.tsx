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
      <Select
        id="reason"
        value=""
        options={[]}
        placeholder="Не выбрано"
        aria-describedby="reason-error"
        onChange={jest.fn()}
      />
    </FormField>,
  );

  expect(screen.getByLabelText('Причина')).toHaveAttribute('aria-describedby', 'reason-error');
  expect(screen.getByText('Выберите значение')).toHaveAttribute('id', 'reason-error');
});

test('opens a select menu upward when the fixed footer limits space below', () => {
  const footer = document.createElement('footer');
  footer.dataset.overlayBoundary = 'bottom';
  document.body.append(footer);
  jest.spyOn(footer, 'getBoundingClientRect').mockReturnValue({ top: 700 } as DOMRect);
  const scrollHeight = jest
    .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
    .mockReturnValue(300);

  render(
    <Select
      id="demand"
      value="replacement"
      options={[{ label: 'Замена', value: 'replacement' }]}
      placeholder="Выберите требование"
      onChange={jest.fn()}
    />,
  );

  const trigger = screen.getByRole('combobox');
  jest
    .spyOn(trigger, 'getBoundingClientRect')
    .mockReturnValue({ top: 600, bottom: 660 } as DOMRect);
  fireEvent.click(trigger);

  expect(screen.getByRole('listbox')).toHaveClass('menuTop');
  scrollHeight.mockRestore();
  footer.remove();
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
