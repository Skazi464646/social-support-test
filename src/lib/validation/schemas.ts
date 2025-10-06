import { z } from 'zod';
import {
  STRING_LENGTH,
  NUMERIC_LIMITS,
  REGEX_PATTERNS,
  FIELD_LIMITS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS
} from '@/constants';

// =============================================================================
// STEP 1: PERSONAL INFORMATION SCHEMA
// =============================================================================

export const step1Schema = z.object({
  // Personal identification
  fullName: z
    .string()
    .min(STRING_LENGTH.MIN.NAME, 'validation.name.too_short')
    .max(STRING_LENGTH.MAX.NAME, 'validation.name.too_long')
    .regex(
      REGEX_PATTERNS.NAME,
      'validation.name.invalid_format'
    ),
  
  nationalId: z
    .string()
    .regex(REGEX_PATTERNS.NATIONAL_ID, 'validation.nationalId.invalid_format')
    .refine((val: string) => {
      // Basic checksum validation for national ID (simplified for demo)
      return val.length === FIELD_LIMITS.NATIONAL_ID.LENGTH && REGEX_PATTERNS.NATIONAL_ID.test(val);
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
        return age - 1 >= NUMERIC_LIMITS.AGE.MIN;
      }
      return age >= NUMERIC_LIMITS.AGE.MIN;
    }, 'validation.dateOfBirth.too_young')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'validation.dateOfBirth.future_date'),
  
  gender: z.enum([GENDER_OPTIONS.MALE, GENDER_OPTIONS.FEMALE, GENDER_OPTIONS.OTHER, GENDER_OPTIONS.PREFER_NOT_TO_SAY], {
    message: 'validation.gender.required'
  }),
  
  // Contact information
  email: z
    .string()
    .email('validation.email.invalid')
    .min(STRING_LENGTH.MIN.EMAIL, 'validation.email.too_short')
    .max(STRING_LENGTH.MAX.EMAIL, 'validation.email.too_long'),
  
  phone: z
    .string()
    .regex(
      REGEX_PATTERNS.PHONE,
      'Please enter a valid phone number'
    )
    .min(STRING_LENGTH.MIN.PHONE, 'Phone number must be at least 8 digits')
    .max(STRING_LENGTH.MAX.PHONE, 'Phone number must not exceed 15 digits'),
  
  // Address information
  address: z
    .string()
    .min(STRING_LENGTH.MIN.ADDRESS, 'Address must be at least 10 characters')
    .max(STRING_LENGTH.MAX.ADDRESS, 'Address must not exceed 200 characters'),
  
  city: z
    .string()
    .min(STRING_LENGTH.MIN.CITY, 'City name must be at least 2 characters')
    .max(STRING_LENGTH.MAX.CITY, 'City name must not exceed 50 characters')
    .regex(REGEX_PATTERNS.CITY_STATE, 'City name can only contain letters'),
  
  state: z
    .string()
    .min(STRING_LENGTH.MIN.STATE, 'State/Emirate name must be at least 2 characters')
    .max(STRING_LENGTH.MAX.STATE, 'State/Emirate name must not exceed 50 characters')
    .regex(REGEX_PATTERNS.CITY_STATE, 'State/Emirate name can only contain letters'),
  
  country: z
    .string()
    .min(1, 'Please select a country'),
  
  postalCode: z
    .string()
    .regex(REGEX_PATTERNS.POSTAL_CODE, 'Postal code must be exactly 5 digits')
    .optional()
    .or(z.literal(''))
});

// =============================================================================
// STEP 2: FAMILY & FINANCIAL INFORMATION SCHEMA
// =============================================================================

export const step2Schema = z.object({
  // Family information
  maritalStatus: z.enum([MARITAL_STATUS_OPTIONS.SINGLE, MARITAL_STATUS_OPTIONS.MARRIED, MARITAL_STATUS_OPTIONS.DIVORCED, MARITAL_STATUS_OPTIONS.WIDOWED, MARITAL_STATUS_OPTIONS.SEPARATED], {
    message: 'Please select your marital status'
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
    .refine((val) => typeof val === 'number', 'Please enter the number of dependents')
    .refine((val) => Number.isInteger(val), 'Number of dependents must be a whole number')
    .refine((val) => val >= NUMERIC_LIMITS.DEPENDENTS.MIN, 'Number of dependents cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.DEPENDENTS.MAX, 'Number of dependents cannot exceed 20'),
  
  // Employment information
  employmentStatus: z.enum([
    EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_FULL_TIME,
    EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_PART_TIME, 
    EMPLOYMENT_STATUS_OPTIONS.SELF_EMPLOYED,
    EMPLOYMENT_STATUS_OPTIONS.UNEMPLOYED,
    EMPLOYMENT_STATUS_OPTIONS.RETIRED,
    EMPLOYMENT_STATUS_OPTIONS.STUDENT,
    EMPLOYMENT_STATUS_OPTIONS.DISABLED
  ], {
    message: 'Please select your employment status'
  }),
  
  occupation: z
    .string()
    .min(STRING_LENGTH.MIN.OCCUPATION, 'Occupation must be at least 2 characters')
    .max(STRING_LENGTH.MAX.OCCUPATION, 'Occupation must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  
  employer: z
    .string()
    .min(STRING_LENGTH.MIN.EMPLOYER, 'Employer name must be at least 2 characters')
    .max(STRING_LENGTH.MAX.EMPLOYER, 'Employer name must not exceed 100 characters')
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
    .refine((val) => typeof val === 'number', 'Please enter your monthly income')
    .refine((val) => val >= NUMERIC_LIMITS.INCOME.MIN, 'Monthly income cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.INCOME.MAX, 'Monthly income cannot exceed 1,000,000'),
  
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
    .refine((val) => typeof val === 'number', 'Please enter your monthly expenses')
    .refine((val) => val >= NUMERIC_LIMITS.EXPENSES.MIN, 'Monthly expenses cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.EXPENSES.MAX, 'Monthly expenses cannot exceed 1,000,000'),
  
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
    .refine((val) => typeof val === 'number', 'Please enter a valid savings amount')
    .refine((val) => val >= NUMERIC_LIMITS.SAVINGS.MIN, 'Total savings cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.SAVINGS.MAX, 'Total savings cannot exceed 10,000,000')
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
    .refine((val) => typeof val === 'number', 'Please enter a valid debt amount')
    .refine((val) => val >= NUMERIC_LIMITS.DEBT.MIN, 'Total debt cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.DEBT.MAX, 'Total debt cannot exceed 10,000,000')
    .optional(),
  
  // Housing information
  housingStatus: z.enum([HOUSING_STATUS_OPTIONS.OWN, HOUSING_STATUS_OPTIONS.RENT, HOUSING_STATUS_OPTIONS.LIVING_WITH_FAMILY, HOUSING_STATUS_OPTIONS.HOMELESS, HOUSING_STATUS_OPTIONS.OTHER], {
    message: 'Please select your housing status'
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
    .refine((val) => typeof val === 'number', 'Please enter a valid rent amount')
    .refine((val) => val >= NUMERIC_LIMITS.RENT.MIN, 'Monthly rent cannot be negative')
    .refine((val) => val <= NUMERIC_LIMITS.RENT.MAX, 'Monthly rent cannot exceed 100,000')
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
    .refine((val) => typeof val === 'boolean', 'Please select an option'),
  
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
    .refine((val) => typeof val === 'boolean', 'Please select an option'),
});

// =============================================================================
// STEP 3: DESCRIPTIVE INFORMATION SCHEMA  
// =============================================================================

export const step3Schema = z.object({
  // Situation descriptions (AI-assisted)
  financialSituation: z
    .string()
    .min(STRING_LENGTH.MIN.DESCRIPTION_SHORT, 'Please provide at least 50 characters describing your financial situation')
    .max(STRING_LENGTH.MAX.DESCRIPTION_LONG, 'Financial situation description cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= STRING_LENGTH.MIN.WORD_COUNT,
      'Please provide at least 10 words describing your financial situation'
    ),
  
  employmentCircumstances: z
    .string()
    .min(STRING_LENGTH.MIN.DESCRIPTION_SHORT, 'Please provide at least 50 characters describing your employment circumstances')
    .max(STRING_LENGTH.MAX.DESCRIPTION_LONG, 'Employment circumstances description cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= STRING_LENGTH.MIN.WORD_COUNT,
      'Please provide at least 10 words describing your employment circumstances'
    ),
  
  reasonForApplying: z
    .string()
    .min(STRING_LENGTH.MIN.DESCRIPTION_SHORT, 'Please provide at least 50 characters explaining your reason for applying')
    .max(STRING_LENGTH.MAX.DESCRIPTION_LONG, 'Reason for applying cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= STRING_LENGTH.MIN.WORD_COUNT,
      'Please provide at least 10 words explaining your reason for applying'
    ),
  
  // Additional information
  additionalComments: z
    .string()
    .max(STRING_LENGTH.MAX.DESCRIPTION_MEDIUM, 'Additional comments cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  // Agreement and consent
  agreeToTerms: z
    .boolean()
    .refine((val: boolean) => val === true, 'You must agree to the terms and conditions'),
  
  consentToDataProcessing: z
    .boolean()
    .refine((val: boolean) => val === true, 'You must consent to data processing'),
  
  allowContactForClarification: z.boolean({
    message: 'Please indicate if we can contact you for clarification'
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
          numberOfDependents: NUMERIC_LIMITS.DEPENDENTS.MIN,
          employmentStatus: undefined,
          occupation: '',
          employer: '',
          monthlyIncome: NUMERIC_LIMITS.INCOME.MIN,
          monthlyExpenses: NUMERIC_LIMITS.EXPENSES.MIN,
          totalSavings: NUMERIC_LIMITS.SAVINGS.MIN,
          totalDebt: NUMERIC_LIMITS.DEBT.MIN,
          housingStatus: undefined,
          monthlyRent: NUMERIC_LIMITS.RENT.MIN,
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