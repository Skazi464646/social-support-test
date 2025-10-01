import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

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
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Line */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step);
            const isCurrent = step === currentStep;
            const isPast = step < currentStep;
            
            return (
              <div
                key={step}
                className={cn(
                  'flex flex-col items-center',
                  'relative'
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200',
                    isCompleted && 'bg-green-500 border-green-500 text-white',
                    isCurrent && !isCompleted && 'bg-primary border-primary text-primary-foreground',
                    !isCurrent && !isCompleted && !isPast && 'bg-background border-muted-foreground text-muted-foreground',
                    isPast && !isCompleted && 'bg-muted border-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-xs font-medium',
                      (isCurrent || isCompleted) && 'text-foreground',
                      !isCurrent && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    Step {step}
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