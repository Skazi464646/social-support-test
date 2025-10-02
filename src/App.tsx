import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/molecules/Toast';
import { HomePage } from '@/pages/HomePage';
import { WizardPage } from '@/pages/WizardPage';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { ErrorPage, RouteErrorPage } from '@/pages/ErrorPage';
import { AppLayout } from '@/components/templates/AppLayout';
import i18n from '@/lib/i18n';

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wizard" element={<WizardPage />} />
                <Route path="/components" element={<ComponentsPage />} />
                <Route path="*" element={<RouteErrorPage />} />
              </Routes>
            </AppLayout>
            <ToastContainer />
          </Router>
        </ToastProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
