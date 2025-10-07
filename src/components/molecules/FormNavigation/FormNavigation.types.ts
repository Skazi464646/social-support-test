/**
 * Form Navigation Component Types
 */

export interface FormNavigationProps {
  currentStep: number;
  completedSteps: Set<number>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  hasError: boolean;
  onPrevious: () => void;
  onRetry: () => void;
  onDebug?: () => void;
}

