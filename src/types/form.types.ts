import type { 
  Step1FormData, 
  Step2FormData, 
  Step3FormData, 
  CompleteFormData, 
  FormStepData 
} from '@/lib/validation/schemas';

// Re-export validation types for consistency
export type { 
  Step1FormData, 
  Step2FormData, 
  Step3FormData, 
  CompleteFormData, 
  FormStepData 
};

// =============================================================================
// FORM WIZARD STATE TYPES
// =============================================================================

export interface FormWizardState {
  currentStep: number;
  formData: FormStepData;
  completedSteps: Set<number>;
  isValid: Record<number, boolean>;
  errors: Record<number, Record<string, string>>;
  isDirty: boolean;
  isSubmitting: boolean;
  lastSaved?: Date;
}

export type FormWizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'UPDATE_FORM_DATA'; payload: { step: number; data: Partial<FormStepData> } }
  | { type: 'SET_STEP_VALID'; payload: { step: number; isValid: boolean } }
  | { type: 'SET_STEP_ERRORS'; payload: { step: number; errors: Record<string, string> } }
  | { type: 'MARK_STEP_COMPLETE'; payload: number }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_FROM_STORAGE'; payload: FormStepData }
  | { type: 'MARK_SAVED' };

// =============================================================================
// FORM FIELD TYPES
// =============================================================================

export interface FormFieldError {
  field: string;
  message: string;
  step: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
  data?: any;
}

// =============================================================================
// FORM SUBMISSION TYPES
// =============================================================================

export interface FormSubmissionData extends CompleteFormData {
  submissionId?: string;
  submittedAt?: Date;
  status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
}

export interface SubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
  applicationId?: string;
  estimatedProcessingTime?: string;
}

export interface SubmissionError {
  code: string;
  message: string;
  field?: string;
  step?: number;
}

// =============================================================================
// FORM AUTO-SAVE TYPES
// =============================================================================

export interface AutoSaveConfig {
  enabled: boolean;
  intervalMs: number;
  storageKey: string;
  maxRetries: number;
}

export interface SaveState {
  lastSaved?: Date;
  isDirty: boolean;
  isSaving: boolean;
  saveError?: string;
}

// =============================================================================
// FORM NAVIGATION TYPES
// =============================================================================

export interface StepNavigationInfo {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  completedSteps: number[];
  nextStep?: number;
  previousStep?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const FORM_STEPS = {
  PERSONAL_INFO: 1,
  FINANCIAL_INFO: 2,
  DESCRIPTIVE_INFO: 3,
} as const;

export const FORM_STEP_NAMES = {
  [FORM_STEPS.PERSONAL_INFO]: 'personal_info',
  [FORM_STEPS.FINANCIAL_INFO]: 'financial_info',
  [FORM_STEPS.DESCRIPTIVE_INFO]: 'descriptive_info',
} as const;

export const TOTAL_STEPS = 3;

export const DEFAULT_AUTO_SAVE_CONFIG: AutoSaveConfig = {
  enabled: true,
  intervalMs: 30000, // 30 seconds
  storageKey: 'social_support_form_data',
  maxRetries: 3,
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type FormStep = typeof FORM_STEPS[keyof typeof FORM_STEPS];
export type FormStepName = typeof FORM_STEP_NAMES[FormStep];

// Helper type for form step components
export interface FormStepComponentProps {
  onNext: () => void;
  onPrevious: () => void;
  onDataChange: (data: Partial<FormStepData>) => void;
  currentData: FormStepData;
  errors: Record<string, string>;
  isSubmitting: boolean;
}