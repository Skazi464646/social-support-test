import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { initializeI18n } from './lib/i18n';
import { startMockServiceWorker } from './mocks/browser';
import './styles/globals.css';

// Initialize services in parallel
Promise.all([
  initializeI18n(),
  startMockServiceWorker()
]).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}).catch((error) => {
  
  // Fallback: render without full service initialization
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
});
