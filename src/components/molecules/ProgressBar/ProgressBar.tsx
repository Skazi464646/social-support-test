import React from 'react';
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
      'relative z-[10] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 transform focus:outline-none',
      status === 'complete' && 'bg-primary-hover text-white border-primary-hover shadow-gold-md scale-105',
      status === 'current' && 'bg-primary text-white border-primary ring-4 ring-primary/30 shadow-gold-lg scale-110',
      status === 'upcoming' && 'bg-white text-foreground border-gray-300'
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
            <CheckCircle className="h-5 w-5 text-white stroke-2" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className={cn(
              'font-bold',
              status === 'current' && 'text-black',
              status === 'upcoming' && 'text-foreground'
            )}>{step}</span>
          )}
        </div>

        <div
          className={cn(
            'mt-2 min-w-0 px-1 text-xs font-medium transition-colors duration-300',
            status === 'upcoming' && 'text-muted-foreground',
            status === 'complete' && 'text-primary font-semibold',
            status === 'current' && 'text-primary font-bold'
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
        <ol
          role="list"
          className={cn(
            'flex w-full items-center',
            isRTL && 'flex-row-reverse'
          )}
        >
          {renderSteps.map((stepElement, index) => (
            <React.Fragment key={`step-${index + 1}`}>
              {stepElement}
              {/* Connecting line after each step (except last) */}
              {index < renderSteps.length - 1 && (
                <div
                  className="flex-1 h-[2px] mx-2 rounded-full transition-all duration-300 self-center"
                  style={{
                    backgroundColor: getStepStatus(index + 1) === 'complete' 
                      ? 'hsl(var(--primary))' 
                      : '#E5E7EB',
                    marginBottom: '20px'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
}
