/**
 * useAIFormContext Hook - Context-Aware AI Enhancement
 * Phase 1: Form Context Extraction
 * 
 * Extracts real-time form data from React Hook Form context to provide
 * context-aware AI suggestions instead of empty objects.
 */

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '@/context/FormWizardContext';
import type { Step1FormData, Step2FormData, Step3FormData, FormStepData } from '@/lib/validation/schemas';

// =============================================================================
// TYPES
// =============================================================================

export interface AIFormContext {
  step1: Partial<Step1FormData>;
  step2: Partial<Step2FormData>;
  step3: Partial<Step3FormData>;
}

export interface FormContextMetrics {
  currentStep: number;
  language: string;
  completeness: {
    step1: number;
    step2: number;
    step3: number;
    overall: number;
  };
  fieldCounts: {
    step1: { filled: number; total: number };
    step2: { filled: number; total: number };
    step3: { filled: number; total: number };
  };
}

export interface AIFormContextResult {
  userContext: AIFormContext;
  metrics: FormContextMetrics;
  isAvailable: boolean;
  currentStepData: Record<string, any>;
  getAllFormData: () => FormStepData;
}

// =============================================================================
// FIELD DEFINITIONS FOR COMPLETENESS CALCULATION
// =============================================================================

const STEP_FIELD_CONFIGS = {
  step1: {
    required: ['fullName', 'nationalId', 'dateOfBirth', 'gender', 'email', 'phone', 'address', 'city', 'state', 'country'],
    optional: ['postalCode'],
  },
  step2: {
    required: ['maritalStatus', 'numberOfDependents', 'employmentStatus', 'monthlyIncome', 'housingStatus', 'receivingBenefits', 'previouslyApplied'],
    optional: ['occupation', 'employer', 'monthlyExpenses', 'totalSavings', 'totalDebt', 'monthlyRent', 'benefitTypes'],
  },
  step3: {
    required: ['financialSituation', 'employmentCircumstances', 'reasonForApplying', 'agreeToTerms', 'consentToDataProcessing'],
    optional: ['additionalComments', 'allowContactForClarification'],
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a field value is considered "filled"
 */
const isFieldFilled = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true; // Booleans are always considered filled
  if (Array.isArray(value)) return value.length > 0;
  return false;
};

/**
 * Calculate completeness percentage for a form step
 */
const calculateStepCompleteness = (
  stepData: Record<string, any>,
  stepKey: keyof typeof STEP_FIELD_CONFIGS
): { percentage: number; filled: number; total: number } => {
  const config = STEP_FIELD_CONFIGS[stepKey];
  const requiredFields = config.required;
  const optionalFields = config.optional;
  const allFields = [...requiredFields, ...optionalFields];

  let filledCount = 0;
  const totalCount = allFields.length;

  allFields.forEach(field => {
    if (isFieldFilled(stepData?.[field])) {
      filledCount++;
    }
  });

  return {
    percentage: totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0,
    filled: filledCount,
    total: totalCount,
  };
};

/**
 * Extract safe context data (remove sensitive information for AI)
 */
const extractSafeContext = (stepData: Record<string, any>, stepKey: string): Record<string, any> => {
  if (!stepData || typeof stepData !== 'object') return {};

  const safeData: Record<string, any> = {};

  // Define which fields are safe to include in AI context
  const safeFields = {
    step1: ['gender', 'city', 'state', 'country'], // Exclude PII like names, IDs, emails
    step2: ['maritalStatus', 'numberOfDependents', 'employmentStatus', 'housingStatus', 'receivingBenefits', 'previouslyApplied'],
    step3: ['agreeToTerms', 'consentToDataProcessing', 'allowContactForClarification'],
  } as const;

  const fieldsToInclude = safeFields[stepKey as keyof typeof safeFields] || [];

  fieldsToInclude.forEach(field => {
    if (field in stepData && isFieldFilled(stepData[field])) {
      safeData[field] = stepData[field];
    }
  });

  // Include derived/categorized information that's safe for AI context
  if (stepKey === 'step2') {
    // Add financial situation indicators without exact amounts
    if (isFieldFilled(stepData.monthlyIncome)) {
      const income = Number(stepData.monthlyIncome) || 0;
      safeData.incomeLevel = income < 5000 ? 'low' : income < 15000 ? 'medium' : 'high';
    }

    if (isFieldFilled(stepData.monthlyExpenses) && isFieldFilled(stepData.monthlyIncome)) {
      const income = Number(stepData.monthlyIncome) || 0;
      const expenses = Number(stepData.monthlyExpenses) || 0;
      safeData.financialBalance = income > expenses ? 'positive' : income === expenses ? 'break_even' : 'deficit';
    }

    if (isFieldFilled(stepData.totalSavings)) {
      const savings = Number(stepData.totalSavings) || 0;
      safeData.savingsLevel = savings < 10000 ? 'low' : savings < 50000 ? 'medium' : 'high';
    }
  }

  return safeData;
};

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * Extract real form context for AI suggestions
 * 
 * This hook replaces the empty `userContext: { step1: {}, step2: {} }` objects
 * with actual form data while maintaining privacy and security.
 */
export function useAIFormContext(): AIFormContextResult {
  const { i18n } = useTranslation();
  
  // Try to get FormWizard context, but handle gracefully if not available
  let formWizardContext: any = null;
  try {
    formWizardContext = useFormWizard();
  } catch (error) {
    // FormWizard context not available - this is expected outside wizard components
    if (process.env.NODE_ENV === 'development') {
      console.debug('[useAIFormContext] FormWizard context not available, using fallback context');
    }
  }
  
  // Try to get React Hook Form context (may not be available in all components)
  let reactHookFormContext: any = null;
  try {
    reactHookFormContext = useFormContext();
  } catch (error) {
    // useFormContext not available - this is expected outside form components
    if (process.env.NODE_ENV === 'development') {
      console.debug('[useAIFormContext] React Hook Form context not available, using FormWizard context only');
    }
  }

  // Get current step data from React Hook Form (if available)
  const getCurrentStepData = (): Record<string, any> => {
    if (reactHookFormContext) {
      try {
        return reactHookFormContext.getValues() || {};
      } catch (error) {
        console.warn('[useAIFormContext] Error getting current form values:', error);
        return {};
      }
    }
    return {};
  };

  // Get all form data from FormWizard context with error handling
  const getAllFormData = (): FormStepData => {
    if (!formWizardContext) {
      return {};
    }
    try {
      return formWizardContext.state?.formData || {};
    } catch (error) {
      console.warn('[useAIFormContext] Error accessing FormWizard context:', error);
      return {};
    }
  };

  // Combine current step data with stored data
  const getCombinedFormData = (): FormStepData => {
    const storedData = getAllFormData();
    const currentStepData = getCurrentStepData();
    const currentStep = formWizardContext?.state?.currentStep || 1;

    if (Object.keys(currentStepData).length > 0) {
      const stepKey = `step${currentStep}` as keyof FormStepData;
      return {
        ...storedData,
        [stepKey]: {
          ...storedData[stepKey],
          ...currentStepData,
        },
      };
    }

    return storedData;
  };

  // Extract safe context for AI with comprehensive error handling
  const buildUserContext = (): AIFormContext => {
    try {
      const combinedData = getCombinedFormData();

      return {
        step1: extractSafeContext(combinedData.step1 || {}, 'step1'),
        step2: extractSafeContext(combinedData.step2 || {}, 'step2'),
        step3: extractSafeContext(combinedData.step3 || {}, 'step3'),
      };
    } catch (error) {
      console.warn('[useAIFormContext] Error building user context, falling back to empty context:', error);
      // Graceful fallback to empty context (backward compatibility)
      return {
        step1: {},
        step2: {},
        step3: {},
      };
    }
  };

  // Calculate form completeness metrics with error handling
  const calculateMetrics = (): FormContextMetrics => {
    try {
      const combinedData = getCombinedFormData();

      const step1Metrics = calculateStepCompleteness(combinedData.step1 || {}, 'step1');
      const step2Metrics = calculateStepCompleteness(combinedData.step2 || {}, 'step2');
      const step3Metrics = calculateStepCompleteness(combinedData.step3 || {}, 'step3');

      const overallPercentage = Math.round(
        (step1Metrics.percentage + step2Metrics.percentage + step3Metrics.percentage) / 3
      );

      return {
        currentStep: formWizardContext?.state?.currentStep || 1,
        language: i18n.language,
        completeness: {
          step1: step1Metrics.percentage,
          step2: step2Metrics.percentage,
          step3: step3Metrics.percentage,
          overall: overallPercentage,
        },
        fieldCounts: {
          step1: { filled: step1Metrics.filled, total: step1Metrics.total },
          step2: { filled: step2Metrics.filled, total: step2Metrics.total },
          step3: { filled: step3Metrics.filled, total: step3Metrics.total },
        },
      };
    } catch (error) {
      console.warn('[useAIFormContext] Error calculating metrics, falling back to defaults:', error);
      // Graceful fallback to zero metrics
      return {
        currentStep: 1,
        language: i18n.language || 'en',
        completeness: {
          step1: 0,
          step2: 0,
          step3: 0,
          overall: 0,
        },
        fieldCounts: {
          step1: { filled: 0, total: 0 },
          step2: { filled: 0, total: 0 },
          step3: { filled: 0, total: 0 },
        },
      };
    }
  };

  // Build the final result
  const userContext = buildUserContext();
  const metrics = calculateMetrics();
  const currentStepData = getCurrentStepData();

  // Context is available if we have at least 70% completion in any step
  const isAvailable = Object.values(metrics.completeness).some(completion => completion >= 70) ||
                     Object.keys(currentStepData).length > 0;

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[useAIFormContext] Context extracted:', {
      isAvailable,
      metrics,
      userContextKeys: Object.keys(userContext),
      step1Keys: Object.keys(userContext.step1),
      step2Keys: Object.keys(userContext.step2),
      step3Keys: Object.keys(userContext.step3),
    });
  }

  return {
    userContext,
    metrics,
    isAvailable,
    currentStepData,
    getAllFormData,
  };
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Get user context with backward compatibility fallback
 */
export function useAIUserContext(): AIFormContext {
  try {
    const { userContext, isAvailable } = useAIFormContext();

    // Provide backward compatibility fallback
    if (!isAvailable) {
      return {
        step1: {},
        step2: {},
        step3: {},
      };
    }

    return userContext;
  } catch (error) {
    // FormWizard context not available - return empty context
    if (process.env.NODE_ENV === 'development') {
      console.debug('[useAIUserContext] FormWizard context not available, returning empty context');
    }
    return {
      step1: {},
      step2: {},
      step3: {},
    };
  }
}

/**
 * Check if the current form step meets the completeness threshold for AI suggestions
 */
export function useFormCompletenessCheck(threshold: number = 70): {
  meetsThreshold: boolean;
  currentStepCompleteness: number;
  overallCompleteness: number;
} {
  try {
    const { metrics } = useAIFormContext();
    const currentStepKey = `step${metrics.currentStep}` as keyof typeof metrics.completeness;
    const currentStepCompleteness = metrics.completeness[currentStepKey] || 0;

    return {
      meetsThreshold: currentStepCompleteness >= threshold,
      currentStepCompleteness,
      overallCompleteness: metrics.completeness.overall,
    };
  } catch (error) {
    // FormWizard context not available - return default values
    if (process.env.NODE_ENV === 'development') {
      console.debug('[useFormCompletenessCheck] FormWizard context not available, returning default values');
    }
    return {
      meetsThreshold: false,
      currentStepCompleteness: 0,
      overallCompleteness: 0,
    };
  }
}