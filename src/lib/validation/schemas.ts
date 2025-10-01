import { z } from 'zod';

// =============================================================================
// STEP 1: PERSONAL INFORMATION SCHEMA
// =============================================================================

export const step1Schema = z.object({
  // Personal identification
  fullName: z
    .string()
    .min(2, 'validation.fullName.min')
    .max(100, 'validation.fullName.max')
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
      'validation.fullName.pattern'
    ),
  
  nationalId: z
    .string()
    .regex(/^[0-9]{10}$/, 'validation.nationalId.pattern')
    .refine((val: string) => {
      // Basic checksum validation for national ID
      const digits = val.split('').map(Number);
      const sum = digits.slice(0, 9).reduce((acc: number, digit: number, index: number) => {
        return acc + digit * (10 - index);
      }, 0);
      const checkDigit = (11 - (sum % 11)) % 11;
      return checkDigit === digits[9];
    }, 'validation.nationalId.invalid'),
  
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
    }, 'validation.dateOfBirth.minAge')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'validation.dateOfBirth.future'),
  
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: 'validation.gender.required'
  }),
  
  // Contact information
  email: z
    .string()
    .email('validation.email.invalid')
    .min(5, 'validation.email.min')
    .max(100, 'validation.email.max'),
  
  phone: z
    .string()
    .regex(
      /^[\+]?[1-9][\d]{0,15}$/,
      'validation.phone.pattern'
    )
    .min(8, 'validation.phone.min')
    .max(15, 'validation.phone.max'),
  
  // Address information
  address: z
    .string()
    .min(10, 'validation.address.min')
    .max(200, 'validation.address.max'),
  
  city: z
    .string()
    .min(2, 'validation.city.min')
    .max(50, 'validation.city.max')
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, 'validation.city.pattern'),
  
  state: z
    .string()
    .min(2, 'validation.state.min')
    .max(50, 'validation.state.max')
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, 'validation.state.pattern'),
  
  country: z
    .string()
    .min(1, 'validation.country.required'),
  
  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/, 'validation.postalCode.pattern')
    .optional()
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
    .number({
      message: 'validation.numberOfDependents.required'
    })
    .int('validation.numberOfDependents.integer')
    .min(0, 'validation.numberOfDependents.min')
    .max(20, 'validation.numberOfDependents.max'),
  
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
    .min(2, 'validation.occupation.min')
    .max(100, 'validation.occupation.max')
    .optional()
    .or(z.literal('')),
  
  employer: z
    .string()
    .min(2, 'validation.employer.min')
    .max(100, 'validation.employer.max')
    .optional()
    .or(z.literal('')),
  
  // Financial information
  monthlyIncome: z
    .number({
      message: 'validation.monthlyIncome.required'
    })
    .min(0, 'validation.monthlyIncome.min')
    .max(1000000, 'validation.monthlyIncome.max'),
  
  monthlyExpenses: z
    .number({
      message: 'validation.monthlyExpenses.required'
    })
    .min(0, 'validation.monthlyExpenses.min')
    .max(1000000, 'validation.monthlyExpenses.max'),
  
  totalSavings: z
    .number({
      message: 'validation.totalSavings.invalid'
    })
    .min(0, 'validation.totalSavings.min')
    .max(10000000, 'validation.totalSavings.max')
    .optional(),
  
  totalDebt: z
    .number({
      message: 'validation.totalDebt.invalid'
    })
    .min(0, 'validation.totalDebt.min')
    .max(10000000, 'validation.totalDebt.max')
    .optional(),
  
  // Housing information
  housingStatus: z.enum(['own', 'rent', 'living_with_family', 'homeless', 'other'], {
    message: 'validation.housingStatus.required'
  }),
  
  monthlyRent: z
    .number({
      message: 'validation.monthlyRent.invalid'
    })
    .min(0, 'validation.monthlyRent.min')
    .max(100000, 'validation.monthlyRent.max')
    .optional(),
  
  // Benefits information
  receivingBenefits: z.boolean({
    message: 'validation.receivingBenefits.required'
  }),
  
  benefitTypes: z
    .array(z.string())
    .optional(),
  
  previouslyApplied: z.boolean({
    message: 'validation.previouslyApplied.required'
  }),
});

// =============================================================================
// STEP 3: DESCRIPTIVE INFORMATION SCHEMA  
// =============================================================================

export const step3Schema = z.object({
  // Situation descriptions (AI-assisted)
  financialSituation: z
    .string()
    .min(50, 'validation.financialSituation.min')
    .max(2000, 'validation.financialSituation.max')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'validation.financialSituation.wordCount'
    ),
  
  employmentCircumstances: z
    .string()
    .min(50, 'validation.employmentCircumstances.min')
    .max(2000, 'validation.employmentCircumstances.max')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'validation.employmentCircumstances.wordCount'
    ),
  
  reasonForApplying: z
    .string()
    .min(50, 'validation.reasonForApplying.min')
    .max(2000, 'validation.reasonForApplying.max')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'validation.reasonForApplying.wordCount'
    ),
  
  // Additional information
  additionalComments: z
    .string()
    .max(1000, 'validation.additionalComments.max')
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