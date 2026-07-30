import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const RequestConsolePage = lazy(() => import('src/pages/RequestConsole'));

export const AppRouter = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/request-console" replace />} />
        <Route path="/request-console" element={<RequestConsolePage />} />
        <Route path="*" element={<Navigate to="/request-console" replace />} />
      </Routes>
    </Suspense>
  );
};
