import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'src/app/store/store';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary
          retryKeys={[location.pathname]}
          onError={(error) => {
            console.error(error);
          }}
        >
          {children}
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

export default Providers;
