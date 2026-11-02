import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

afterEach(() => Object.assign(globalThis, { __SHOW_API_ERROR_DETAILS__: false }));

test.each([false, true])('API details follow the environment flag: %s', (enabled) => {
  Object.assign(globalThis, { __SHOW_API_ERROR_DETAILS__: enabled });
  render(<ErrorMessage notice={{ source: 'api', message: 'Ответ API', details: 'Диагностика' }} />);
  expect(screen.getByText('Ответ сервиса')).toBeInTheDocument();
  expect(screen.getByText('Ответ API')).toBeInTheDocument();
  if (enabled) {
    expect(screen.getByText('Технические подробности')).toBeInTheDocument();
    expect(screen.getByText('Диагностика')).toBeInTheDocument();
  } else {
    expect(screen.queryByText('Технические подробности')).not.toBeInTheDocument();
    expect(screen.queryByText('Диагностика')).not.toBeInTheDocument();
  }
});

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
