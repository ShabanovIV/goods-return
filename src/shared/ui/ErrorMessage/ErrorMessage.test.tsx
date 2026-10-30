import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

test('labels local form messages and preserves their text', () => {
  render(<ErrorMessage notice="Файл уже добавлен." />);
  expect(screen.getByText('Сообщение формы')).toBeInTheDocument();
  expect(screen.getByText('Файл уже добавлен.')).toBeInTheDocument();
});

test('shows the original HTML as inert text in expandable details', () => {
  const html = '<html><script>alert(1)</script>Bad gateway</html>';
  const { container } = render(
    <ErrorMessage notice={{ source: 'request', message: 'Ошибка', details: html }} />,
  );
  const details = container.querySelector('details')!;
  expect(details.open).toBe(false);
  fireEvent.click(screen.getByText('Технические подробности'));
  expect(details.open).toBe(true);
  expect(screen.getByText(html)).toBeInTheDocument();
  expect(container.querySelector('script')).toBeNull();
});
