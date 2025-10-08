import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { ERROR_PAGE_FALLBACKS } from '@/constants/errorPage';

interface ErrorBoundaryProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

function ErrorPageContent({ error, resetErrorBoundary }: ErrorBoundaryProps = {}) {
  const { t } = useTranslation();
  const displayError = error;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl text-center">
        <Card className="p-8">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('error.title', ERROR_PAGE_FALLBACKS.title)}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {displayError?.message || t('error.description', ERROR_PAGE_FALLBACKS.description)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {typeof resetErrorBoundary === 'function' && (
              <Button onClick={resetErrorBoundary} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t('error.retry', ERROR_PAGE_FALLBACKS.retry)}
              </Button>
            )}
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.location.assign('/')}
            >
              <Home className="h-4 w-4" />
              {t('error.home', ERROR_PAGE_FALLBACKS.home)}
            </Button>
          </div>

          {import.meta.env.DEV && displayError && (
            <details className="mt-8 text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto text-destructive">
                {displayError.stack || displayError.message}
              </pre>
            </details>
          )}
        </Card>
      </div>
    </div>
  );
}

export function ErrorPage(props: ErrorBoundaryProps = {}) {
  return <ErrorPageContent {...props} />;
}

export function RouteErrorPage() {
  const routeError = useRouteError() as Error | undefined;
  return <ErrorPageContent error={routeError} />;
}
