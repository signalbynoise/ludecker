import { TEXT_BODY_CLASS } from '@ludecker/ui';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './router';
import './vite-styles';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Vite root element #root not found');
}

document.body.classList.add(TEXT_BODY_CLASS);

createRoot(rootElement).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
