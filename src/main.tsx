import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { initializeI18n } from './lib/i18n';
import { startMockServiceWorker } from './mocks/browser';
import './styles/globals.css';

console.log('[Main] Starting app initialization...');

// Initialize services in parallel
Promise.all([
  initializeI18n(),
  startMockServiceWorker()
]).then(() => {
  console.log('[Main] All services initialized successfully, rendering app...');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('[Main] App rendered successfully');
}).catch((error) => {
  console.error('[Main] Failed to initialize services:', error);
  
  // Fallback: render without full service initialization
  console.log('[Main] Attempting fallback render...');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('[Main] Fallback render completed');
});
