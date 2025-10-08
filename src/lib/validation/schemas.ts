import { z } from 'zod';
import { VALIDATION_LIMITS, VALIDATION_REGEX, FORM_LIMITS, FAMILY_LIMITS, FINANCIAL_LIMITS } from '@/constants';

// =============================================================================
// STEP 1: PERSONAL INFORMATION SCHEMA
// =============================================================================

export const step1Schema = z.object({
  // Personal identification
  fullName: z
    .string()
    .min(VALIDATION_LIMITS.name.min, 'validation.name.too_short')
    .max(VALIDATION_LIMITS.name.max, 'validation.name.too_long')
    .regex(
      VALIDATION_REGEX.name,
      'validation.name.invalid_format'
    ),
  
  nationalId: z
    .string()
    .regex(VALIDATION_REGEX.numbersOnly10, 'validation.nationalId.invalid_format')
    .refine((val: string) => {
      // Basic checksum validation for national ID (simplified for demo)
      return val.length === 10 && /^[0-9]+$/.test(val);
    }, 'validation.nationalId.invalid_checksum'),
  
  dateOfBirth: z
    .string()
    .min(1, 'validation.dateOfBirth.required')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'validation.dateOfBirth.too_young')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'validation.dateOfBirth.future_date'),
  
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: 'validation.gender.required'
  }),
  
  // Contact information
  email: z
    .string()
    .email('validation.email.invalid')
    .min(VALIDATION_LIMITS.email.min, 'validation.email.too_short')
    .max(VALIDATION_LIMITS.email.max, 'validation.email.too_long'),
  
  phone: z
    .string()
    .regex(
      VALIDATION_REGEX.phoneIntl,
      'validation.phone.invalid'
    )
    .min(VALIDATION_LIMITS.phone.min, 'validation.phone.too_short')
    .max(VALIDATION_LIMITS.phone.max, 'validation.phone.too_long'),
  
  // Address information
  address: z
    .string()
    .min(VALIDATION_LIMITS.address.min, 'validation.address.too_short')
    .max(VALIDATION_LIMITS.address.max, 'validation.address.too_long'),
  
  city: z
    .string()
    .min(VALIDATION_LIMITS.city.min, 'validation.city.too_short')
    .max(VALIDATION_LIMITS.city.max, 'validation.city.too_long')
    .regex(VALIDATION_REGEX.cityOrState, 'validation.city.invalid_format'),
  
  state: z
    .string()
    .min(VALIDATION_LIMITS.state.min, 'validation.state.too_short')
    .max(VALIDATION_LIMITS.state.max, 'validation.state.too_long')
    .regex(VALIDATION_REGEX.cityOrState, 'validation.state.invalid_format'),
  
  country: z
    .string()
    .min(1, 'validation.country.required'),
  
  postalCode: z
    .string()
    .regex(new RegExp(`^[0-9]{${VALIDATION_LIMITS.postalCode.length}}$`), 'validation.postalCode.invalid_format')
    .optional()
    .or(z.literal(''))
});

// =============================================================================
// STEP 2: FAMILY & FINANCIAL INFORMATION SCHEMA
// =============================================================================

export const step2Schema = z.object({
  // Family information
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
    message: 'validation.maritalStatus.required'
  }),
  
  numberOfDependents: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.numberOfDependents.required')
    .refine((val) => Number.isInteger(val), 'validation.numberOfDependents.not_integer')
    .refine((val) => val >= 0, 'validation.numberOfDependents.negative')
    .refine((val) => val <= FAMILY_LIMITS.dependentsMax, 'validation.numberOfDependents.too_large'),
  
  // Employment information
  employmentStatus: z.enum([
    'employed_full_time',
    'employed_part_time', 
    'self_employed',
    'unemployed',
    'retired',
    'student',
    'disabled'
  ], {
    message: 'validation.employmentStatus.required'
  }),
  
  occupation: z
    .string()
    .min(2, 'validation.occupation.too_short')
    .max(100, 'validation.occupation.too_long')
    .optional()
    .or(z.literal('')),
  
  employer: z
    .string()
    .min(2, 'validation.employer.too_short')
    .max(100, 'validation.employer.too_long')
    .optional()
    .or(z.literal('')),
  
  // Financial information
  monthlyIncome: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.monthlyIncome.required')
    .refine((val) => val >= 0, 'validation.monthlyIncome.negative')
    .refine((val) => val <= FINANCIAL_LIMITS.monthlyIncomeMax, 'validation.monthlyIncome.too_large'),
  
  monthlyExpenses: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.monthlyExpenses.required')
    .refine((val) => val >= 0, 'validation.monthlyExpenses.negative')
    .refine((val) => val <= FINANCIAL_LIMITS.monthlyExpensesMax, 'validation.monthlyExpenses.too_large'),
  
  totalSavings: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.totalSavings.required')
    .refine((val) => val >= 0, 'validation.totalSavings.negative')
    .refine((val) => val <= FINANCIAL_LIMITS.totalSavingsMax, 'validation.totalSavings.too_large')
    .optional(),
  
  totalDebt: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.totalDebt.required')
    .refine((val) => val >= 0, 'validation.totalDebt.negative')
    .refine((val) => val <= FINANCIAL_LIMITS.totalDebtMax, 'validation.totalDebt.too_large')
    .optional(),
  
  // Housing information
  housingStatus: z.enum(['own', 'rent', 'living_with_family', 'homeless', 'other'], {
    message: 'validation.housingStatus.required'
  }),
  
  monthlyRent: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0; // Default empty to 0
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num; // Default invalid to 0
      }
      return val;
    })
    .refine((val) => typeof val === 'number', 'validation.monthlyRent.required')
    .refine((val) => val >= 0, 'validation.monthlyRent.negative')
    .refine((val) => val <= FINANCIAL_LIMITS.monthlyRentMax, 'validation.monthlyRent.too_large')
    .optional(),
  
  // Benefits information
  receivingBenefits: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val === 'true';
      }
      return val;
    })
    .refine((val) => typeof val === 'boolean', 'validation.receivingBenefits.required'),
  
  benefitTypes: z
    .array(z.string())
    .optional(),
  
  previouslyApplied: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val === 'true';
      }
      return val;
    })
    .refine((val) => typeof val === 'boolean', 'validation.previouslyApplied.required'),
});

// =============================================================================
// STEP 3: DESCRIPTIVE INFORMATION SCHEMA  
// =============================================================================

export const step3Schema = z.object({
  // Situation descriptions (AI-assisted)
  financialSituation: z
    .string()
    .min(FORM_LIMITS.step3.minChars, 'validation.financialSituation.too_short')
    .max(FORM_LIMITS.step3.maxChars, 'validation.financialSituation.too_long')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= FORM_LIMITS.step3.minWords,
      'validation.financialSituation.too_few_words'
    ),
  
  employmentCircumstances: z
    .string()
    .min(FORM_LIMITS.step3.minChars, 'validation.employmentCircumstances.too_short')
    .max(FORM_LIMITS.step3.maxChars, 'validation.employmentCircumstances.too_long')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= FORM_LIMITS.step3.minWords,
      'validation.employmentCircumstances.too_few_words'
    ),
  
  reasonForApplying: z
    .string()
    .min(FORM_LIMITS.step3.minChars, 'validation.reasonForApplying.too_short')
    .max(FORM_LIMITS.step3.maxChars, 'validation.reasonForApplying.too_long')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= FORM_LIMITS.step3.minWords,
      'validation.reasonForApplying.too_few_words'
    ),
  
  // Additional information
  additionalComments: z
    .string()
    .max(FORM_LIMITS.additionalComments.maxChars, 'validation.additionalComments.too_long')
    .optional()
    .or(z.literal('')),
  
  // Agreement and consent
  agreeToTerms: z
    .boolean()
    .refine((val: boolean) => val === true, 'validation.agreeToTerms.required'),
  
  consentToDataProcessing: z
    .boolean()
    .refine((val: boolean) => val === true, 'validation.consentToDataProcessing.required'),
  
  allowContactForClarification: z.boolean({
    message: 'validation.allowContactForClarification.required'
  }),
});

// =============================================================================
// COMPLETE FORM SCHEMA
// =============================================================================

export const completeFormSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;

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
 * Validate a specific form step
 */
export const validateFormStep = (step: number, data: unknown) => {
  const schemas = [step1Schema, step2Schema, step3Schema];
  const schema = schemas[step - 1];
  
  if (!schema) {
    throw new Error(`Invalid step number: ${step}`);
  }
  
  return schema.safeParse(data);
};

/**
 * Validate the complete form
 */
export const validateCompleteForm = (data: unknown) => {
  return completeFormSchema.safeParse(data);
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