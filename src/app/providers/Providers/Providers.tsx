import { FC, ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary
      retryKeys={[location.pathname]}
      onError={(error) => {
        console.error(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default Providers;
