import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/molecules';
import { ThemeToggle, DirectionToggle } from '@/components/ui';
import type { BaseComponentProps } from '@/types';

interface HeaderProps extends BaseComponentProps {}

export function Header({ className = '' }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 mb-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {t('header.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('header.subtitle')}
            </p>
          </div>
          <div className="space-x-4-rtl flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
            <DirectionToggle />
          </div>
        </div>
      </div>
    </header>
  );
}