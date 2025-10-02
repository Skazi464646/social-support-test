import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const BUTTON_TOKENS = {
  // Button widths for consistent sizing
  width: {
    desktop: 'w-[120px]',
    mobileMin: 'min-w-[120px]',
    mobileMax: 'max-w-[120px]',
  },
  // Spacing tokens
  gap: {
    buttons: 'gap-2',
    sections: 'gap-3',
    indicators: 'gap-2',
  },
  // Layout tokens
  padding: {
    section: 'mt-8 pt-6',
    mobile: 'space-y-4',
  },
} as const;

// =============================================================================
// TYPES
// =============================================================================

interface FormNavigationProps {
  currentStep: number;
  completedSteps: Set<number>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  hasError: boolean;
  onPrevious: () => void;
  onRetry: () => void;
  onDebug?: () => void;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function StepIndicators({ currentStep, completedSteps }: Pick<FormNavigationProps, 'currentStep' | 'completedSteps'>) {
  return (
    <div className={`flex ${BUTTON_TOKENS.gap.indicators}`}>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
            step === currentStep && 'bg-primary text-primary-foreground',
            step < currentStep && 'bg-green-500 text-white',
            step > currentStep && 'bg-muted text-muted-foreground'
          )}
        >
          {completedSteps.has(step) ? '✓' : step}
        </div>
      ))}
    </div>
  );
}

function ActionButtons({
  currentStep,
  isSubmitting,
  isSubmitted,
  hasError,
  onRetry,
  isMobile = false,
}: Omit<FormNavigationProps, 'onDebug'> & { isMobile?: boolean }) {
  const { t } = useTranslation();
  const buttonSize = isMobile ? 'sm' : undefined;

  const getSubmitButtonText = () => {
    if (isSubmitted) return t('form.submitted');
    return currentStep === 3 ? t('actions.submit') : t('actions.next');
  };

  const mobileButtonWidths = cn(
    'flex-1',
    BUTTON_TOKENS.width.mobileMin,
    BUTTON_TOKENS.width.mobileMax
  );

  return (
    <div
      className={cn(
        'flex items-center',
        BUTTON_TOKENS.gap.buttons,
        isMobile && 'flex-shrink-0'
      )}
    >
      {hasError && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={isSubmitting}
          size={buttonSize}
          className={isMobile ? mobileButtonWidths : BUTTON_TOKENS.width.desktop}
        >
          {t('actions.retry')}
        </Button>
      )}
      
      <Button
        type="submit"
        disabled={isSubmitting || isSubmitted}
        isLoading={isSubmitting}
        size={buttonSize}
        className={cn(
          isMobile ? mobileButtonWidths : BUTTON_TOKENS.width.desktop
        )}
      >
        {getSubmitButtonText()}
      </Button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FormNavigation(props: FormNavigationProps) {
  const { t } = useTranslation();
  const { currentStep, onPrevious, onDebug } = props;

  return (
    <div className={`${BUTTON_TOKENS.padding.section} border-t`}>
      {/* Mobile Layout */}
      <div className={`block sm:hidden ${BUTTON_TOKENS.padding.mobile}`}>
        <div className="flex justify-center">
          <StepIndicators currentStep={currentStep} completedSteps={props.completedSteps} />
        </div>
        
        <div
          className={cn(
            'flex items-center justify-center',
            BUTTON_TOKENS.gap.sections
          )}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 1}
            size="sm"
            className={cn(
              'flex-1',
              BUTTON_TOKENS.width.mobileMin,
              BUTTON_TOKENS.width.mobileMax
            )}
          >
            {t('actions.back')}
          </Button>
          
          <ActionButtons {...props} isMobile />
        </div>
        
        {onDebug && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onDebug}
              size="sm"
              className="text-xs"
            >
              DEBUG
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={BUTTON_TOKENS.width.desktop}
        >
          {t('actions.back')}
        </Button>

        {/* Centered step indicators */}
        <div className="flex-1 flex justify-center">
          <StepIndicators currentStep={currentStep} completedSteps={props.completedSteps} />
        </div>

        <ActionButtons {...props} />
      </div>
    </div>
  );
}
