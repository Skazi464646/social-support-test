import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { initializeI18n } from './lib/i18n';
import './styles/globals.css';

console.log('[Main] Starting app initialization...');

// Initialize i18n with enhanced configuration
initializeI18n().then(() => {
  console.log('[Main] i18n initialized successfully, rendering app...');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('[Main] App rendered successfully');
}).catch((error) => {
  console.error('[Main] Failed to initialize i18n:', error);
  
  // Fallback: render without i18n
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
