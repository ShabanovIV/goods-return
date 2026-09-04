import { render, screen } from '@testing-library/react';
import { ClaimDetailsStep } from './ClaimDetailsStep';

test('places the options between the client demand and description', () => {
  const dictionary = { items: [], isLoading: false, retry: jest.fn() };
  render(
    <ClaimDetailsStep
      reasonId=""
      clientDemandId=""
      flawId=""
      description=""
      reasons={dictionary}
      demands={dictionary}
      flaws={dictionary}
      flawsEnabled={false}
      showErrors={false}
      isLeftAddress={false}
      isOpenClient={false}
      onReasonChange={jest.fn()}
      onDemandChange={jest.fn()}
      onFlawChange={jest.fn()}
      onDescriptionChange={jest.fn()}
      onLeftAddressChange={jest.fn()}
      onOpenClientChange={jest.fn()}
    />,
  );
  const demand = screen.getByLabelText('Требование клиента');
  const options = screen.getByRole('region', { name: 'Параметры претензии' });
  const description = screen.getByLabelText('Суть претензии');
  expect(demand.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(
    options.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(screen.getAllByRole('switch')).toHaveLength(2);
});
