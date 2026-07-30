import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';

test('renders the lazy request console route', async () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/request-console']}>
        <App />
      </MemoryRouter>
    </Provider>,
  );

  expect(screen.getByTestId('app-root')).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: 'Выполнить запрос' })).toBeInTheDocument();
});
