import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import 'src/shared/styles/globals.scss';
import Providers from './app/providers/Providers/Providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
