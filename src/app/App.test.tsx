import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';

test('shows a helpful message when document id is missing', async () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </Provider>,
  );

  expect(screen.getByTestId('app-root')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Не указан документ' })).toBeInTheDocument();
});
