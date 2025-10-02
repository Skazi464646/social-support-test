import { z } from 'zod';

// =============================================================================
// STEP 1: PERSONAL INFORMATION SCHEMA
// =============================================================================

export const step1Schema = z.object({
  // Personal identification
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  
  nationalId: z
    .string()
    .regex(/^[0-9]{10}$/, 'National ID must be exactly 10 digits')
    .refine((val: string) => {
      // Basic checksum validation for national ID (simplified for demo)
      return val.length === 10 && /^[0-9]+$/.test(val);
    }, 'Please enter a valid National ID'),
  
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'You must be at least 18 years old')
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of birth cannot be in the future'),
  
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: 'Please select your gender'
  }),
  
  // Contact information
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters'),
  
  phone: z
    .string()
    .regex(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number must not exceed 15 digits'),
  
  // Address information
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  city: z
    .string()
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name must not exceed 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, 'City name can only contain letters'),
  
  state: z
    .string()
    .min(2, 'State/Emirate name must be at least 2 characters')
    .max(50, 'State/Emirate name must not exceed 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, 'State/Emirate name can only contain letters'),
  
  country: z
    .string()
    .min(1, 'Please select a country'),
  
  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/, 'Postal code must be exactly 5 digits')
    .optional()
    .or(z.literal(''))
});

// =============================================================================
// STEP 2: FAMILY & FINANCIAL INFORMATION SCHEMA
// =============================================================================

export const step2Schema = z.object({
  // Family information
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
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
    .refine((val) => val >= 0, 'Number of dependents cannot be negative')
    .refine((val) => val <= 20, 'Number of dependents cannot exceed 20'),
  
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
    message: 'Please select your employment status'
  }),
  
  occupation: z
    .string()
    .min(2, 'Occupation must be at least 2 characters')
    .max(100, 'Occupation must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  
  employer: z
    .string()
    .min(2, 'Employer name must be at least 2 characters')
    .max(100, 'Employer name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  
  // Financial information
  monthlyIncome: z
    .number({
      message: 'Please enter your monthly income'
    })
    .min(0, 'Monthly income cannot be negative')
    .max(1000000, 'Monthly income cannot exceed 1,000,000'),
  
  monthlyExpenses: z
    .number({
      message: 'Please enter your monthly expenses'
    })
    .min(0, 'Monthly expenses cannot be negative')
    .max(1000000, 'Monthly expenses cannot exceed 1,000,000'),
  
  totalSavings: z
    .number({
      message: 'Please enter a valid savings amount'
    })
    .min(0, 'Total savings cannot be negative')
    .max(10000000, 'Total savings cannot exceed 10,000,000')
    .optional(),
  
  totalDebt: z
    .number({
      message: 'Please enter a valid debt amount'
    })
    .min(0, 'Total debt cannot be negative')
    .max(10000000, 'Total debt cannot exceed 10,000,000')
    .optional(),
  
  // Housing information
  housingStatus: z.enum(['own', 'rent', 'living_with_family', 'homeless', 'other'], {
    message: 'Please select your housing status'
  }),
  
  monthlyRent: z
    .number({
      message: 'Please enter a valid rent amount'
    })
    .min(0, 'Monthly rent cannot be negative')
    .max(100000, 'Monthly rent cannot exceed 100,000')
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
    .min(50, 'Please provide at least 50 characters describing your financial situation')
    .max(2000, 'Financial situation description cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'Please provide at least 10 words describing your financial situation'
    ),
  
  employmentCircumstances: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your employment circumstances')
    .max(2000, 'Employment circumstances description cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'Please provide at least 10 words describing your employment circumstances'
    ),
  
  reasonForApplying: z
    .string()
    .min(50, 'Please provide at least 50 characters explaining your reason for applying')
    .max(2000, 'Reason for applying cannot exceed 2000 characters')
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      'Please provide at least 10 words explaining your reason for applying'
    ),
  
  // Additional information
  additionalComments: z
    .string()
    .max(1000, 'Additional comments cannot exceed 1000 characters')
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