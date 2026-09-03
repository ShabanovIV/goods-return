import { fireEvent, render, screen } from '@testing-library/react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import Providers from './Providers';

const DocumentRoute = () => <h1>Документ: {useParams().documentId}</h1>;

afterEach(() => {
  Object.assign(globalThis, { __APP_BASE_PATH__: '/' });
  window.history.replaceState(null, '', '/');
});

test.each(['/', '/goods-return/', '/service/claims/'])(
  'opens a direct document URL and builds links with base path %s',
  (basePath) => {
    Object.assign(globalThis, { __APP_BASE_PATH__: basePath });
    window.history.replaceState(null, '', `${basePath}invoices/123`);

    render(
      <Providers>
        <Link to="/invoices/456">Другой документ</Link>
        <Routes>
          <Route path="/invoices/:documentId" element={<DocumentRoute />} />
        </Routes>
      </Providers>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('Документ: 123');
    expect(screen.getByRole('link')).toHaveAttribute('href', `${basePath}invoices/456`);
    fireEvent.click(screen.getByRole('link'));
    expect(window.location.pathname).toBe(`${basePath}invoices/456`);
    expect(screen.getByRole('heading')).toHaveTextContent('Документ: 456');
  },
);
