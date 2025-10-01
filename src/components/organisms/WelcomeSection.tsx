import { useTranslation } from 'react-i18next';
import type { BaseComponentProps } from '@/types';

interface WelcomeSectionProps extends BaseComponentProps {}

export function WelcomeSection({ className = '' }: WelcomeSectionProps) {
  const { t } = useTranslation();

  return (
    <div className={`form-section dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <h2 className="form-title dark:text-white">{t('welcome.title')}</h2>
      <p className="form-description dark:text-gray-300">
        {t('welcome.subtitle')}
      </p>
      <div className="space-x-4-rtl flex">
        <button className="btn-primary">Get Started</button>
        <button className="btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
          Learn More
        </button>
      </div>
    </div>
  );
}