import { z } from 'zod';
import i18n from '@/lib/i18n/config';

// =============================================================================
// ZOD-I18N BRIDGE
// =============================================================================

/**
 * Custom error map that uses i18n for validation messages
 */
export const createZodI18nErrorMap = (t: (key: string, options?: any) => string) => {
  const errorMap: z.ZodErrorMap = (issue, ctx) => {
    let message: string;
    
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.expected === 'string') {
          message = t('validation.invalid_type_expected_string', { received: issue.received });
        } else if (issue.expected === 'number') {
          message = t('validation.invalid_type_expected_number', { received: issue.received });
        } else if (issue.expected === 'boolean') {
          message = t('validation.invalid_type_expected_boolean', { received: issue.received });
        } else if (issue.expected === 'date') {
          message = t('validation.invalid_type_expected_date', { received: issue.received });
        } else {
          message = t('validation.invalid_type', { expected: issue.expected, received: issue.received });
        }
        break;
        
      case z.ZodIssueCode.invalid_literal:
        message = t('validation.invalid_literal', { expected: issue.expected });
        break;
        
      case z.ZodIssueCode.unrecognized_keys:
        message = t('validation.unrecognized_keys', { keys: issue.keys.join(', ') });
        break;
        
      case z.ZodIssueCode.invalid_union:
        message = t('validation.invalid_union');
        break;
        
      case z.ZodIssueCode.invalid_union_discriminator:
        message = t('validation.invalid_union_discriminator', { options: issue.options.join(', ') });
        break;
        
      case z.ZodIssueCode.invalid_enum_value:
        message = t('validation.invalid_enum_value', { 
          options: issue.options.join(', '), 
          received: issue.received 
        });
        break;
        
      case z.ZodIssueCode.invalid_arguments:
        message = t('validation.invalid_arguments');
        break;
        
      case z.ZodIssueCode.invalid_return_type:
        message = t('validation.invalid_return_type');
        break;
        
      case z.ZodIssueCode.invalid_date:
        message = t('validation.invalid_date');
        break;
        
      case z.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') {
          message = t('validation.invalid_string_email');
        } else if (issue.validation === 'url') {
          message = t('validation.invalid_string_url');
        } else if (issue.validation === 'regex') {
          message = t('validation.invalid_string_regex');
        } else {
          message = t('validation.invalid_string');
        }
        break;
        
      case z.ZodIssueCode.too_small:
        if (issue.type === 'array') {
          message = t('validation.too_small', { minimum: issue.minimum });
        } else if (issue.type === 'string') {
          message = t('validation.invalid_string_min', { minimum: issue.minimum });
        } else if (issue.type === 'number') {
          message = t('validation.invalid_number_min', { minimum: issue.minimum });
        } else if (issue.type === 'date') {
          message = t('validation.invalid_date_min', { minimum: issue.minimum });
        } else {
          message = t('validation.too_small', { minimum: issue.minimum });
        }
        break;
        
      case z.ZodIssueCode.too_big:
        if (issue.type === 'array') {
          message = t('validation.too_big', { maximum: issue.maximum });
        } else if (issue.type === 'string') {
          message = t('validation.invalid_string_max', { maximum: issue.maximum });
        } else if (issue.type === 'number') {
          message = t('validation.invalid_number_max', { maximum: issue.maximum });
        } else if (issue.type === 'date') {
          message = t('validation.invalid_date_max', { maximum: issue.maximum });
        } else {
          message = t('validation.too_big', { maximum: issue.maximum });
        }
        break;
        
      case z.ZodIssueCode.invalid_intersection_types:
        message = t('validation.invalid_intersection_types');
        break;
        
      case z.ZodIssueCode.not_multiple_of:
        message = t('validation.not_multiple_of', { multipleOf: issue.multipleOf });
        break;
        
      case z.ZodIssueCode.not_finite:
        message = t('validation.not_finite');
        break;
        
      case z.ZodIssueCode.custom:
        message = issue.message || t('validation.custom');
        break;
        
      default:
        message = ctx.defaultError;
    }
    
    return { message };
  };
  
  return errorMap;
};

/**
 * Get the current error map based on current language
 */
export const getCurrentErrorMap = () => {
  const t = (key: string, options?: any) => i18n.t(key, options);
  return createZodI18nErrorMap(t);
};

/**
 * Custom validation helpers that use i18n
 */
export const createI18nValidators = (t: (key: string, options?: any) => string) => ({
  // Name validation
  name: () => z
    .string()
    .min(2, t('validation.name.too_short'))
    .max(100, t('validation.name.too_long'))
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
      t('validation.name.invalid_format')
    ),
    
  // National ID validation
  nationalId: () => z
    .string()
    .regex(/^[0-9]{10}$/, t('validation.nationalId.invalid_format'))
    .refine((val: string) => {
      return val.length === 10 && /^[0-9]+$/.test(val);
    }, t('validation.nationalId.invalid_checksum')),
    
  // Date of birth validation
  dateOfBirth: () => z
    .string()
    .min(1, t('validation.dateOfBirth.required'))
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, t('validation.dateOfBirth.too_young'))
    .refine((date: string) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, t('validation.dateOfBirth.future_date')),
    
  // Gender validation
  gender: () => z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: t('validation.gender.required')
  }),
  
  // Email validation
  email: () => z
    .string()
    .email(t('validation.email.invalid'))
    .min(5, t('validation.email.too_short'))
    .max(100, t('validation.email.too_long')),
    
  // Phone validation
  phone: () => z
    .string()
    .regex(
      /^[\+]?[1-9][\d]{0,15}$/,
      t('validation.phone.invalid')
    )
    .min(8, t('validation.phone.too_short'))
    .max(15, t('validation.phone.too_long')),
    
  // Address validation
  address: () => z
    .string()
    .min(10, t('validation.address.too_short'))
    .max(200, t('validation.address.too_long')),
    
  // City validation
  city: () => z
    .string()
    .min(2, t('validation.city.too_short'))
    .max(50, t('validation.city.too_long'))
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, t('validation.city.invalid_format')),
    
  // State validation
  state: () => z
    .string()
    .min(2, t('validation.state.too_short'))
    .max(50, t('validation.state.too_long'))
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, t('validation.state.invalid_format')),
    
  // Country validation
  country: () => z
    .string()
    .min(1, t('validation.country.required')),
    
  // Postal code validation
  postalCode: () => z
    .string()
    .regex(/^[0-9]{5}$/, t('validation.postalCode.invalid_format'))
    .optional()
    .or(z.literal('')),
    
  // Marital status validation
  maritalStatus: () => z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
    message: t('validation.maritalStatus.required')
  }),
  
  // Number of dependents validation
  numberOfDependents: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.numberOfDependents.required'))
    .refine((val) => Number.isInteger(val), t('validation.numberOfDependents.not_integer'))
    .refine((val) => val >= 0, t('validation.numberOfDependents.negative'))
    .refine((val) => val <= 20, t('validation.numberOfDependents.too_large')),
    
  // Employment status validation
  employmentStatus: () => z.enum([
    'employed_full_time',
    'employed_part_time', 
    'self_employed',
    'unemployed',
    'retired',
    'student',
    'disabled'
  ], {
    message: t('validation.employmentStatus.required')
  }),
  
  // Occupation validation
  occupation: () => z
    .string()
    .min(2, t('validation.occupation.too_short'))
    .max(100, t('validation.occupation.too_long'))
    .optional()
    .or(z.literal('')),
    
  // Employer validation
  employer: () => z
    .string()
    .min(2, t('validation.employer.too_short'))
    .max(100, t('validation.employer.too_long'))
    .optional()
    .or(z.literal('')),
    
  // Monthly income validation
  monthlyIncome: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.monthlyIncome.required'))
    .refine((val) => val >= 0, t('validation.monthlyIncome.negative'))
    .refine((val) => val <= 1000000, t('validation.monthlyIncome.too_large')),
    
  // Monthly expenses validation
  monthlyExpenses: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.monthlyExpenses.required'))
    .refine((val) => val >= 0, t('validation.monthlyExpenses.negative'))
    .refine((val) => val <= 1000000, t('validation.monthlyExpenses.too_large')),
    
  // Total savings validation
  totalSavings: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.totalSavings.invalid'))
    .refine((val) => val >= 0, t('validation.totalSavings.negative'))
    .refine((val) => val <= 10000000, t('validation.totalSavings.too_large'))
    .optional(),
    
  // Total debt validation
  totalDebt: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.totalDebt.invalid'))
    .refine((val) => val >= 0, t('validation.totalDebt.negative'))
    .refine((val) => val <= 10000000, t('validation.totalDebt.too_large'))
    .optional(),
    
  // Housing status validation
  housingStatus: () => z.enum(['own', 'rent', 'living_with_family', 'homeless', 'other'], {
    message: t('validation.housingStatus.required')
  }),
  
  // Monthly rent validation
  monthlyRent: () => z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => typeof val === 'number', t('validation.monthlyRent.invalid'))
    .refine((val) => val >= 0, t('validation.monthlyRent.negative'))
    .refine((val) => val <= 100000, t('validation.monthlyRent.too_large'))
    .optional(),
    
  // Receiving benefits validation
  receivingBenefits: () => z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val === 'true';
      }
      return val;
    })
    .refine((val) => typeof val === 'boolean', t('validation.receivingBenefits.required')),
    
  // Benefit types validation
  benefitTypes: () => z
    .array(z.string())
    .optional(),
    
  // Previously applied validation
  previouslyApplied: () => z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val === 'true';
      }
      return val;
    })
    .refine((val) => typeof val === 'boolean', t('validation.previouslyApplied.required')),
    
  // Financial situation validation
  financialSituation: () => z
    .string()
    .min(50, t('validation.financialSituation.too_short'))
    .max(2000, t('validation.financialSituation.too_long'))
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      t('validation.financialSituation.too_few_words')
    ),
    
  // Employment circumstances validation
  employmentCircumstances: () => z
    .string()
    .min(50, t('validation.employmentCircumstances.too_short'))
    .max(2000, t('validation.employmentCircumstances.too_long'))
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      t('validation.employmentCircumstances.too_few_words')
    ),
    
  // Reason for applying validation
  reasonForApplying: () => z
    .string()
    .min(50, t('validation.reasonForApplying.too_short'))
    .max(2000, t('validation.reasonForApplying.too_long'))
    .refine(
      (text: string) => text.trim().split(/\s+/).length >= 10,
      t('validation.reasonForApplying.too_few_words')
    ),
    
  // Additional comments validation
  additionalComments: () => z
    .string()
    .max(1000, t('validation.additionalComments.too_long'))
    .optional()
    .or(z.literal('')),
    
  // Agree to terms validation
  agreeToTerms: () => z
    .boolean()
    .refine((val: boolean) => val === true, t('validation.agreeToTerms.required')),
    
  // Consent to data processing validation
  consentToDataProcessing: () => z
    .boolean()
    .refine((val: boolean) => val === true, t('validation.consentToDataProcessing.required')),
    
  // Allow contact for clarification validation
  allowContactForClarification: () => z.boolean({
    message: t('validation.allowContactForClarification.required')
  }),
});