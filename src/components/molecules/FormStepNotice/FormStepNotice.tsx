import { useTranslation } from 'react-i18next';
import { ICON_SIZE } from '@/constants/ui';

export type FormStepNoticeVariant = 'info' | 'warning' | 'success';

export type FormStepNoticeProps = {
  variant: FormStepNoticeVariant;
  titleKey: string;
  descriptionKey: string;
  fallbacks: {
    title: string;
    text: string;
  };
  className?: string;
};

const containerClasses: Record<FormStepNoticeVariant, string> = {
  info: 'border border-info-border bg-info-light rounded-lg p-4',
  warning: 'border border-warning-border bg-warning-light rounded-lg p-4',
  success: 'border border-success-border bg-success-light rounded-lg p-4',
};

const iconColorClasses: Record<FormStepNoticeVariant, string> = {
  info: 'text-info mt-0.5',
  warning: 'text-warning mt-0.5',
  success: 'text-success mt-0.5',
};

const titleColorClasses: Record<FormStepNoticeVariant, string> = {
  info: 'text-info-foreground',
  warning: 'text-warning-foreground',
  success: 'text-success-light-foreground',
};

const paragraphColorClasses: Record<FormStepNoticeVariant, string> = {
  info: 'text-info-light-foreground',
  warning: 'text-warning-light-foreground',
  success: 'text-success-light-foreground/90',
};

function VariantIcon({ variant }: { variant: FormStepNoticeVariant }) {
  if (variant === 'warning') {
    return (
      <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  }

  if (variant === 'success') {
    return (
      <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  }

  return (
    <svg className={ICON_SIZE.DEFAULT} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

export function FormStepNotice({ variant, titleKey, descriptionKey, fallbacks, className }: FormStepNoticeProps) {
  const { t } = useTranslation(['form', 'common']);
  const containerClass = containerClasses[variant];
  const titleClass = titleColorClasses[variant];
  const paragraphClass = paragraphColorClasses[variant];

  return (
    <div className={className ? `${containerClass} ${className}` : containerClass}>
      <div className="flex items-start gap-3">
        <div className={iconColorClasses[variant]}>
          <VariantIcon variant={variant} />
        </div>
        <div>
          <h4 className={`font-medium ${titleClass} mb-1`}>
            {t(titleKey, fallbacks.title)}
          </h4>
          <p className={`text-sm ${paragraphClass}`}>
            {t(descriptionKey, fallbacks.text)}
          </p>
        </div>
      </div>
    </div>
  );
}


