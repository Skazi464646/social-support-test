import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import type { AppLayoutProps } from './AppLayout.types';

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
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-primary/5 supports-[backdrop-filter]:via-primary/8 supports-[backdrop-filter]:to-primary/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between max-w-screen-2xl mx-auto">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-80 group">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-all duration-300 group-hover:shadow-gold-sm group-hover:scale-110">
                <FileText className="h-4 w-4" />
              </div>
              <span className="hidden text-lg font-semibold sm:inline-block truncate transition-colors duration-300 group-hover:text-primary">
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
                    'p-2 rounded-md transition-all duration-300 hover:bg-primary/15 hover:text-primary hover:shadow-gold-sm hover:scale-105',
                    item.current 
                      ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm' 
                      : 'text-foreground/70 hover:text-primary'
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
                    'flex items-center space-x-2 text-base font-medium transition-all duration-300 hover:text-primary whitespace-nowrap px-3 py-2 rounded-md hover:bg-primary/15 hover:shadow-gold-sm hover:scale-105 hover:border-primary/30',
                    item.current 
                      ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm' 
                      : 'text-foreground/70 hover:text-primary border border-transparent'
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