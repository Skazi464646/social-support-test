import { z } from 'zod';
import { useMemo } from 'react';
import { 
  step1Schema as baseStep1Schema,
  step2Schema as baseStep2Schema,
  step3Schema as baseStep3Schema
} from './schemas';

// =============================================================================
// I18N-AWARE SCHEMA HOOKS
// =============================================================================

/**
 * Hook that returns language-aware validation schemas
 * For now, we'll use the base schemas and rely on error message translation
 * in the ValidatedFormField component
 */
export function useValidationSchemas() {
  const schemas = useMemo(() => {
    // Use the base schemas directly - translation happens in ValidatedFormField
    return {
      step1Schema: baseStep1Schema,
      step2Schema: baseStep2Schema,
      step3Schema: baseStep3Schema,
      completeFormSchema: z.object({
        step1: baseStep1Schema,
        step2: baseStep2Schema,
        step3: baseStep3Schema,
      }),
    };
  }, []);

  return schemas;
}

/**
 * Get validation schema for a specific step
 */
export function useStepValidationSchema(step: number) {
  const schemas = useValidationSchemas();
  
  return useMemo(() => {
    switch (step) {
      case 1:
        return schemas.step1Schema;
      case 2:
        return schemas.step2Schema;
      case 3:
        return schemas.step3Schema;
      default:
        throw new Error(`Invalid step number: ${step}`);
    }
  }, [schemas, step]);
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type Step1FormData = z.infer<ReturnType<typeof useValidationSchemas>['step1Schema']>;
export type Step2FormData = z.infer<ReturnType<typeof useValidationSchemas>['step2Schema']>;
export type Step3FormData = z.infer<ReturnType<typeof useValidationSchemas>['step3Schema']>;
export type CompleteFormData = z.infer<ReturnType<typeof useValidationSchemas>['completeFormSchema']>;

// Individual step form data for partial validation
export type FormStepData = {
  step1?: Partial<Step1FormData>;
  step2?: Partial<Step2FormData>;
  step3?: Partial<Step3FormData>;
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate a specific form step with current language
 */
export const validateFormStep = (step: number, data: unknown) => {
  const schemas = [baseStep1Schema, baseStep2Schema, baseStep3Schema];
  const schema = schemas[step - 1];
  
  if (!schema) {
    throw new Error(`Invalid step number: ${step}`);
  }
  
  return schema.safeParse(data);
};

/**
 * Get default values for a form step
 */
export const getStepDefaults = (step: number): Partial<FormStepData> => {
  switch (step) {
    case 1:
      return {
        step1: {
          fullName: '',
          nationalId: '',
          dateOfBirth: '',
          gender: undefined,
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        }
      };
    case 2:
      return {
        step2: {
          maritalStatus: undefined,
          numberOfDependents: 0,
          employmentStatus: undefined,
          occupation: '',
          employer: '',
          monthlyIncome: 0,
          monthlyExpenses: 0,
          totalSavings: 0,
          totalDebt: 0,
          housingStatus: undefined,
          monthlyRent: 0,
          receivingBenefits: false,
          benefitTypes: [],
          previouslyApplied: false,
        }
      };
    case 3:
      return {
        step3: {
          financialSituation: '',
          employmentCircumstances: '',
          reasonForApplying: '',
          additionalComments: '',
          agreeToTerms: false,
          consentToDataProcessing: false,
          allowContactForClarification: false,
        }
      };
    default:
      return {};
  }
};