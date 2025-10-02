import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// TYPES
// =============================================================================

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: Set<number>;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProgressBar({
  currentStep,
  totalSteps,
  completedSteps = new Set(),
  className,
}: ProgressBarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);
  const progressRatio = totalSteps > 1 ? Math.min(Math.max((currentStep - 1) / (totalSteps - 1), 0), 1) : 0;

  const getStepStatus = (step: number) => {
    if (completedSteps.has(step) || step < currentStep) {
      return 'complete' as const;
    }
    if (step === currentStep) {
      return 'current' as const;
    }
    return 'upcoming' as const;
  };

  const renderSteps = steps.map((step) => {
    const status = getStepStatus(step);

    const statusText =
      status === 'current'
        ? t('progress.status_current', 'Current step')
        : status === 'complete'
          ? t('progress.status_complete', 'Completed step')
          : t('progress.status_upcoming', 'Upcoming step');

    const circleClasses = cn(
      'relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 transform',
      status === 'complete' && 'bg-[var(--color-green-500)] text-white border-transparent shadow-sm',
      status === 'current' && 'bg-[var(--color-green-500)] text-white border-transparent shadow-lg scale-105',
      status === 'upcoming' && 'bg-surface text-muted-foreground border-muted-border'
    );

    return (
      <li key={step} className="flex flex-col items-center text-center">
        <div className={circleClasses} aria-current={status === 'current' ? 'step' : undefined}>
          <span className="sr-only">
            {t('progress.step_indicator', {
              step,
              total: totalSteps,
              status: statusText,
              defaultValue: `Step ${step} of ${totalSteps} – ${statusText}`,
            })}
          </span>
          {status === 'complete' ? (
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">{step}</span>
          )}
        </div>

        <div
          className={cn(
            'mt-2 min-w-0 px-1 text-xs font-medium text-muted-foreground',
            (status === 'current' || status === 'complete') && 'text-foreground'
          )}
        >
          {t('progress.step_label', { step })}
        </div>
      </li>
    );
  });

  return (
    <nav
      className={cn('w-full', className)}
      aria-label={t('progress.nav_label', 'Application progress')}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-[20px] top-5 h-[2px] bg-border"
          aria-hidden="true"
        />
        <div
          className={cn(
            'pointer-events-none absolute top-5 h-[2px] bg-[var(--color-green-500)] origin-left transition-transform duration-300',
            isRTL && 'left-auto right-[20px] origin-right',
            !isRTL && 'left-[20px]'
          )}
          style={{
            width: 'calc(100% - 40px)',
            transform: `scaleX(${progressRatio})`,
          }}
          aria-hidden="true"
        />
        <ol
          role="list"
          className={cn(
            'relative z-[1] flex w-full items-center justify-between',
            isRTL && 'flex-row-reverse'
          )}
        >
          {renderSteps}
        </ol>
      </div>
    </nav>
  );
}
