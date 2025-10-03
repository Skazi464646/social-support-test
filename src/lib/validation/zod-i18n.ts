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
    
    // Get the field path to determine which field this error is for
    const fieldPath = issue.path.length > 0 ? issue.path.join('.') : '';
    
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.expected === 'string') {
          message = t('validation.invalid_type_expected_string', { received: issue.received });
        } else if (issue.expected === 'number') {
          message = t('validation.invalid_type_expected_number', { received: issue.received });
        } else if (issue.expected === 'boolean') {
          message = t('validation.invalid_type_expected_boolean', { received: issue.received });
        } else {
          message = t('validation.invalid_type', { expected: issue.expected, received: issue.received });
        }
        break;
        
      case z.ZodIssueCode.unrecognized_keys:
        message = t('validation.unrecognized_keys', { keys: issue.keys.join(', ') });
        break;
        
      case z.ZodIssueCode.invalid_union:
        message = t('validation.invalid_union');
        break;
        
      case 'invalid_enum_value' as any:
        // Use field-specific error messages for enum validation
        if (fieldPath === 'gender') {
          message = t('validation.gender.required');
        } else if (fieldPath === 'maritalStatus') {
          message = t('validation.maritalStatus.required');
        } else if (fieldPath === 'employmentStatus') {
          message = t('validation.employmentStatus.required');
        } else if (fieldPath === 'housingStatus') {
          message = t('validation.housingStatus.required');
        } else if (fieldPath === 'country') {
          message = t('validation.country.required');
        } else {
          message = t('validation.invalid_enum_value', { 
            options: (issue as any).options?.join(', ') || '', 
            received: (issue as any).received 
          });
        }
        break;
        
      case 'invalid_string' as any:
        if (issue.validation === 'email') {
          message = t('validation.email.invalid');
        } else if (issue.validation === 'regex') {
          // Use field-specific error messages for regex validation
          if (fieldPath === 'fullName') {
            message = t('validation.name.invalid_format');
          } else if (fieldPath === 'nationalId') {
            message = t('validation.nationalId.invalid_format');
          } else if (fieldPath === 'phone') {
            message = t('validation.phone.invalid');
          } else if (fieldPath === 'city') {
            message = t('validation.city.invalid_format');
          } else if (fieldPath === 'state') {
            message = t('validation.state.invalid_format');
          } else if (fieldPath === 'postalCode') {
            message = t('validation.postalCode.invalid_format');
          } else {
            message = t('validation.invalid_string_regex');
          }
        } else {
          message = t('validation.invalid_string');
        }
        break;
        
      case z.ZodIssueCode.too_small:
        if (issue.type === 'array') {
          message = t('validation.too_small', { minimum: issue.minimum });
        } else if (issue.type === 'string') {
          // Use field-specific error messages when available
          if (fieldPath === 'fullName') {
            message = t('validation.name.too_short');
          } else if (fieldPath === 'nationalId') {
            message = t('validation.nationalId.invalid_format');
          } else if (fieldPath === 'email') {
            message = t('validation.email.too_short');
          } else if (fieldPath === 'phone') {
            message = t('validation.phone.too_short');
          } else if (fieldPath === 'address') {
            message = t('validation.address.too_short');
          } else if (fieldPath === 'city') {
            message = t('validation.city.too_short');
          } else if (fieldPath === 'state') {
            message = t('validation.state.too_short');
          } else if (fieldPath === 'financialSituation') {
            message = t('validation.financialSituation.too_short');
          } else if (fieldPath === 'employmentCircumstances') {
            message = t('validation.employmentCircumstances.too_short');
          } else if (fieldPath === 'reasonForApplying') {
            message = t('validation.reasonForApplying.too_short');
          } else {
            message = t('validation.invalid_string_min', { minimum: issue.minimum });
          }
        } else if (issue.type === 'number') {
          message = t('validation.invalid_number_min', { minimum: issue.minimum });
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
        } else {
          message = t('validation.too_big', { maximum: issue.maximum });
        }
        break;
        
      case z.ZodIssueCode.not_multiple_of:
        message = t('validation.not_multiple_of', { multipleOf: issue.multipleOf });
        break;
        
      case z.ZodIssueCode.custom:
        // Handle custom refinement errors with field-specific messages
        if (fieldPath === 'dateOfBirth') {
          message = t('validation.dateOfBirth.too_young');
        } else if (fieldPath === 'nationalId') {
          message = t('validation.nationalId.invalid_checksum');
        } else if (fieldPath === 'numberOfDependents') {
          message = t('validation.numberOfDependents.required');
        } else if (fieldPath === 'monthlyIncome') {
          message = t('validation.monthlyIncome.required');
        } else if (fieldPath === 'monthlyExpenses') {
          message = t('validation.monthlyExpenses.required');
        } else if (fieldPath === 'receivingBenefits') {
          message = t('validation.receivingBenefits.required');
        } else if (fieldPath === 'previouslyApplied') {
          message = t('validation.previouslyApplied.required');
        } else if (fieldPath === 'financialSituation') {
          message = t('validation.financialSituation.too_few_words');
        } else if (fieldPath === 'employmentCircumstances') {
          message = t('validation.employmentCircumstances.too_few_words');
        } else if (fieldPath === 'reasonForApplying') {
          message = t('validation.reasonForApplying.too_few_words');
        } else if (fieldPath === 'agreeToTerms') {
          message = t('validation.agreeToTerms.required');
        } else if (fieldPath === 'consentToDataProcessing') {
          message = t('validation.consentToDataProcessing.required');
        } else {
          message = issue.message || t('validation.custom');
        }
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
  const t = (key: string, options?: any): string => {
    // Ensure we're using the current language from i18n and return as string
    const result = i18n.t(key, options);
    return typeof result === 'string' ? result : String(result);
  };
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