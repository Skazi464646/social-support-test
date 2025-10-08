import type { AppLayoutProps } from './AppLayout.types';
import { Header } from '@/components/molecules/Header/Header';

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
      </footer>
    </div>
  );
}