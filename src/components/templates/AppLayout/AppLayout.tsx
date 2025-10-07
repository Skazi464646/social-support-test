import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    {
      name: t('nav.home', 'Home'),
      href: '/',
      icon: Home,
      current: location.pathname === '/',
    },
    {
      name: t('nav.form_wizard', 'Form Wizard'),
      href: '/wizard',
      icon: FileText,
      current: location.pathname === '/wizard',
    },
    {
      name: t('nav.components', 'Components'),
      href: '/components',
      icon: Layers,
      current: location.pathname === '/components',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between max-w-screen-2xl mx-auto">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <span className="hidden text-sm font-bold sm:inline-block truncate">
                {t('app.name', 'Social Support Portal')}
              </span>
            </Link>

            {/* Mobile Navigation */}
            <nav className="flex sm:hidden items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'p-2 rounded-md transition-colors hover:bg-accent',
                    item.current 
                      ? 'text-foreground bg-accent' 
                      : 'text-foreground/60'
                  )}
                  aria-label={item.name}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </nav>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm transition-colors hover:text-foreground/80 whitespace-nowrap',
                    item.current 
                      ? 'text-foreground' 
                      : 'text-foreground/60'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline-block">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <LanguageSwitcher />
              <div className="hidden sm:flex items-center space-x-1">
                <ThemeToggle />
                
                {/* GitHub link */}
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden lg:inline-flex"
                >
                  <a
                    href={import.meta.env.VITE_GITHUB_REPO_URL || 'https://github.com/Skazi464646/social-support-test'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('nav.github', 'GitHub repository')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

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