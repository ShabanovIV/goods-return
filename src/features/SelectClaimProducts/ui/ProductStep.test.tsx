import { render, screen } from '@testing-library/react';
import { ProductStep } from './ProductStep';

test('does not show claim options on the product step', () => {
  render(
    <ProductStep
      products={[]}
      selectedLines={{}}
      showErrors={false}
      onToggle={jest.fn()}
      onAmountChange={jest.fn()}
    />,
  );
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
});
