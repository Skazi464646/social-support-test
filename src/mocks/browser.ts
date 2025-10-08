import { setupWorker } from 'msw/browser';
import { formSubmissionHandlers } from './handlers/form-submission';

// Create MSW worker with all handlers
export const worker = setupWorker(...formSubmissionHandlers);

// Start the worker in development
export const startMockServiceWorker = async () => {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      });
    } catch (error) {
      
    }
  }
};