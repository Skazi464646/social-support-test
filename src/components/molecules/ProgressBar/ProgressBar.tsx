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
  className 
}: ProgressBarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={cn('w-full', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress Line */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-1/2 inset-x-0 h-0.5 bg-muted -translate-y-1/2" />
        
        {/* Progress fill line - adjusts direction based on RTL */}
        <div 
          className={cn(
            "absolute top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300",
            isRTL ? "right-0" : "left-0"
          )}
          style={{ 
            width: `${progressPercentage}%`,
            transformOrigin: isRTL ? 'right' : 'left'
          }}
        />
        
        {/* Step indicators */}
        <div className={cn(
          "relative flex",
          isRTL ? "justify-between flex-row-reverse" : "justify-between"
        )}>
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step);
            const isCurrent = step === currentStep;
            const isPast = step < currentStep;
            
            return (
              <div
                key={step}
                className="flex flex-col items-center relative"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={t('progress.step_indicator', { step, total: totalSteps })}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 relative z-10',
                    // Enhanced styling with better contrast
                    isCompleted && 'bg-green-500 border-green-500 text-white shadow-sm',
                    isCurrent && !isCompleted && 'bg-primary border-primary text-primary-foreground shadow-sm ring-2 ring-primary/20',
                    !isCurrent && !isCompleted && !isPast && 'bg-background border-muted-foreground/60 text-muted-foreground',
                    isPast && !isCompleted && 'bg-muted border-muted text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className={cn(isRTL && "transform scale-x-[-1]")}>
                      {step}
                    </span>
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-2 text-center min-w-0">
                  <div
                    className={cn(
                      'text-xs font-medium whitespace-nowrap px-1',
                      (isCurrent || isCompleted) && 'text-foreground',
                      !isCurrent && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    {t('progress.step_label', { step })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}