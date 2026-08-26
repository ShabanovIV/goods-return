import { fireEvent, render, screen } from '@testing-library/react';
import { ClaimOptions } from './ClaimOptions';

test('renders defaults and changes both claim options', () => {
  const onLeftAddressChange = jest.fn();
  const onOpenClientChange = jest.fn();
  render(
    <ClaimOptions
      isLeftAddress
      isOpenClient={false}
      onLeftAddressChange={onLeftAddressChange}
      onOpenClientChange={onOpenClientChange}
    />,
  );

  const leftAddress = screen.getByRole('switch', { name: /Товар оставлен на адресе/ });
  const openClient = screen.getByRole('switch', {
    name: /Упаковка вскрыта в присутствии клиента/,
  });
  expect(leftAddress).toBeChecked();
  expect(openClient).not.toBeChecked();

  fireEvent.click(leftAddress);
  fireEvent.click(openClient);
  expect(onLeftAddressChange).toHaveBeenCalledWith(false);
  expect(onOpenClientChange).toHaveBeenCalledWith(true);
});
