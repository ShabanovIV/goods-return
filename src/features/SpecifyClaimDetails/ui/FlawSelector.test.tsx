import { fireEvent, render, screen } from '@testing-library/react';
import { ClaimDetailsStep } from './ClaimDetailsStep';
import { FlawSelector } from './FlawSelector';

const flaws = [
  { id: 'flaw-1', name: 'Скрип' },
  { id: 'flaw-2', name: 'Некомплект' },
];

test('allows selecting only one flaw', () => {
  const onChange = jest.fn();

  render(
    <FlawSelector
      enabled
      flawId=""
      flaws={flaws}
      isLoading={false}
      onChange={onChange}
      onRetry={jest.fn()}
      showErrors={false}
    />,
  );

  fireEvent.click(screen.getByRole('combobox', { name: 'Недостаток' }));
  fireEvent.click(screen.getByRole('option', { name: 'Некомплект' }));
  expect(onChange).toHaveBeenCalledWith('flaw-2');
});

test('disables flaw selection until a reason is selected', () => {
  render(
    <FlawSelector
      enabled={false}
      flawId=""
      flaws={flaws}
      isLoading={false}
      onChange={jest.fn()}
      onRetry={jest.fn()}
      showErrors={false}
    />,
  );

  expect(screen.getByLabelText('Недостаток')).toBeDisabled();
  expect(screen.getByLabelText('Недостаток')).toHaveTextContent('Сначала выберите причину');
});

test('renders reason, flaw and demand in the required order', () => {
  const dictionaryState = { isLoading: false, retry: jest.fn() };

  render(
    <ClaimDetailsStep
      reasonId=""
      clientDemandId=""
      flawId=""
      description=""
      reasons={{ ...dictionaryState, items: [{ id: 'reason-1', name: 'Причина' }] }}
      flaws={{ ...dictionaryState, items: flaws }}
      demands={{ ...dictionaryState, items: [{ id: 'demand-1', name: 'Замена' }] }}
      flawsEnabled
      showErrors={false}
      onReasonChange={jest.fn()}
      onFlawChange={jest.fn()}
      onDemandChange={jest.fn()}
      onDescriptionChange={jest.fn()}
    />,
  );

  const labels = screen
    .getAllByRole('combobox')
    .map((select) => (select as HTMLButtonElement).labels?.item(0)?.textContent);
  expect(labels).toEqual(['Причина', 'Недостаток', 'Требование клиента']);
  expect(screen.getByLabelText('Суть претензии')).toHaveAttribute('maxlength', '1000');
});
