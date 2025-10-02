import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { createI18nValidators, getCurrentErrorMap } from './zod-i18n';

// =============================================================================
// I18N-AWARE SCHEMA HOOKS
// =============================================================================

/**
 * Hook that returns language-aware validation schemas
 */
export function useValidationSchemas() {
  const { t } = useTranslation(['form', 'validation']);
  
  // Create validators with current language
  const validators = useMemo(() => createI18nValidators(t), [t]);
  
  // Create schemas using the validators
  const schemas = useMemo(() => {
    // Set the error map for zod to use i18n
    z.setErrorMap(getCurrentErrorMap());
    
    // Step 1 Schema
    const step1Schema = z.object({
      fullName: validators.name(),
      nationalId: validators.nationalId(),
      dateOfBirth: validators.dateOfBirth(),
      gender: validators.gender(),
      email: validators.email(),
      phone: validators.phone(),
      address: validators.address(),
      city: validators.city(),
      state: validators.state(),
      country: validators.country(),
      postalCode: validators.postalCode(),
    });

    // Step 2 Schema
    const step2Schema = z.object({
      maritalStatus: validators.maritalStatus(),
      numberOfDependents: validators.numberOfDependents(),
      employmentStatus: validators.employmentStatus(),
      occupation: validators.occupation(),
      employer: validators.employer(),
      monthlyIncome: validators.monthlyIncome(),
      monthlyExpenses: validators.monthlyExpenses(),
      totalSavings: validators.totalSavings(),
      totalDebt: validators.totalDebt(),
      housingStatus: validators.housingStatus(),
      monthlyRent: validators.monthlyRent(),
      receivingBenefits: validators.receivingBenefits(),
      benefitTypes: validators.benefitTypes(),
      previouslyApplied: validators.previouslyApplied(),
    });

    // Step 3 Schema
    const step3Schema = z.object({
      financialSituation: validators.financialSituation(),
      employmentCircumstances: validators.employmentCircumstances(),
      reasonForApplying: validators.reasonForApplying(),
      additionalComments: validators.additionalComments(),
      agreeToTerms: validators.agreeToTerms(),
      consentToDataProcessing: validators.consentToDataProcessing(),
      allowContactForClarification: validators.allowContactForClarification(),
    });

    // Complete form schema
    const completeFormSchema = z.object({
      step1: step1Schema,
      step2: step2Schema,
      step3: step3Schema,
    });

    return {
      step1Schema,
      step2Schema,
      step3Schema,
      completeFormSchema,
    };
  }, [validators]);

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
export const validateFormStep = (step: number, data: unknown, t: (key: string, options?: any) => string) => {
  const validators = createI18nValidators(t);
  z.setErrorMap(getCurrentErrorMap());
  
  let schema;
  switch (step) {
    case 1:
      schema = z.object({
        fullName: validators.name(),
        nationalId: validators.nationalId(),
        dateOfBirth: validators.dateOfBirth(),
        gender: validators.gender(),
        email: validators.email(),
        phone: validators.phone(),
        address: validators.address(),
        city: validators.city(),
        state: validators.state(),
        country: validators.country(),
        postalCode: validators.postalCode(),
      });
      break;
    case 2:
      schema = z.object({
        maritalStatus: validators.maritalStatus(),
        numberOfDependents: validators.numberOfDependents(),
        employmentStatus: validators.employmentStatus(),
        occupation: validators.occupation(),
        employer: validators.employer(),
        monthlyIncome: validators.monthlyIncome(),
        monthlyExpenses: validators.monthlyExpenses(),
        totalSavings: validators.totalSavings(),
        totalDebt: validators.totalDebt(),
        housingStatus: validators.housingStatus(),
        monthlyRent: validators.monthlyRent(),
        receivingBenefits: validators.receivingBenefits(),
        benefitTypes: validators.benefitTypes(),
        previouslyApplied: validators.previouslyApplied(),
      });
      break;
    case 3:
      schema = z.object({
        financialSituation: validators.financialSituation(),
        employmentCircumstances: validators.employmentCircumstances(),
        reasonForApplying: validators.reasonForApplying(),
        additionalComments: validators.additionalComments(),
        agreeToTerms: validators.agreeToTerms(),
        consentToDataProcessing: validators.consentToDataProcessing(),
        allowContactForClarification: validators.allowContactForClarification(),
      });
      break;
    default:
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