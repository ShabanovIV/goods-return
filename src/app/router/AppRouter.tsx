import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const ClaimFormPage = lazy(() => import('src/pages/ClaimForm'));

export const AppRouter = () => {
  return (
    <Suspense fallback={<div aria-label="Загрузка страницы" />}>
      <Routes>
        <Route path="/invoices/:documentId" element={<ClaimFormPage />} />
        <Route path="*" element={<ClaimFormPage />} />
      </Routes>
    </Suspense>
  );
};
