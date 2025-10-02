import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { ThemeToggle, DirectionToggle } from '@/components/ui/ThemeToggle';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          {/* Logo/Brand */}
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <span className="hidden font-bold sm:inline-block">
                {t('app.name', 'Social Support Portal')}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 text-sm transition-colors hover:text-foreground/80',
                  item.current 
                    ? 'text-foreground' 
                    : 'text-foreground/60'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <DirectionToggle />
              
              {/* GitHub link */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:inline-flex"
              >
                <a
                  href="https://github.com/anthropics/claude-code"
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
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {t('footer.copyright', 'Built with Claude Code. A production-ready social support application.')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-xs text-muted-foreground">
              {t('footer.ai_powered', 'AI-Powered Form Assistance')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}