// =============================================================================
// VALIDATION ERROR MESSAGE KEYS
// =============================================================================
// This file contains all validation error message keys used in Zod schemas
// These keys should match the keys in translation files

export const VALIDATION_KEYS = {
  // Step 1: Personal Information
  FULL_NAME: {
    MIN: 'validation.fullName.min',
    MAX: 'validation.fullName.max',
    PATTERN: 'validation.fullName.pattern',
  },
  
  NATIONAL_ID: {
    PATTERN: 'validation.nationalId.pattern',
    INVALID: 'validation.nationalId.invalid',
  },
  
  DATE_OF_BIRTH: {
    REQUIRED: 'validation.dateOfBirth.required',
    MIN_AGE: 'validation.dateOfBirth.minAge',
    FUTURE: 'validation.dateOfBirth.future',
  },
  
  GENDER: {
    REQUIRED: 'validation.gender.required',
  },
  
  EMAIL: {
    INVALID: 'validation.email.invalid',
    MIN: 'validation.email.min',
    MAX: 'validation.email.max',
  },
  
  PHONE: {
    PATTERN: 'validation.phone.pattern',
    MIN: 'validation.phone.min',
    MAX: 'validation.phone.max',
  },
  
  ADDRESS: {
    MIN: 'validation.address.min',
    MAX: 'validation.address.max',
  },
  
  CITY: {
    MIN: 'validation.city.min',
    MAX: 'validation.city.max',
    PATTERN: 'validation.city.pattern',
  },
  
  STATE: {
    MIN: 'validation.state.min',
    MAX: 'validation.state.max',
    PATTERN: 'validation.state.pattern',
  },
  
  COUNTRY: {
    REQUIRED: 'validation.country.required',
  },
  
  POSTAL_CODE: {
    PATTERN: 'validation.postalCode.pattern',
  },

  // Step 2: Family & Financial Information
  MARITAL_STATUS: {
    REQUIRED: 'validation.maritalStatus.required',
  },
  
  NUMBER_OF_DEPENDENTS: {
    REQUIRED: 'validation.numberOfDependents.required',
    INTEGER: 'validation.numberOfDependents.integer',
    MIN: 'validation.numberOfDependents.min',
    MAX: 'validation.numberOfDependents.max',
  },
  
  EMPLOYMENT_STATUS: {
    REQUIRED: 'validation.employmentStatus.required',
  },
  
  OCCUPATION: {
    MIN: 'validation.occupation.min',
    MAX: 'validation.occupation.max',
  },
  
  EMPLOYER: {
    MIN: 'validation.employer.min',
    MAX: 'validation.employer.max',
  },
  
  MONTHLY_INCOME: {
    REQUIRED: 'validation.monthlyIncome.required',
    MIN: 'validation.monthlyIncome.min',
    MAX: 'validation.monthlyIncome.max',
  },
  
  MONTHLY_EXPENSES: {
    REQUIRED: 'validation.monthlyExpenses.required',
    MIN: 'validation.monthlyExpenses.min',
    MAX: 'validation.monthlyExpenses.max',
  },
  
  TOTAL_SAVINGS: {
    INVALID: 'validation.totalSavings.invalid',
    MIN: 'validation.totalSavings.min',
    MAX: 'validation.totalSavings.max',
  },
  
  TOTAL_DEBT: {
    INVALID: 'validation.totalDebt.invalid',
    MIN: 'validation.totalDebt.min',
    MAX: 'validation.totalDebt.max',
  },
  
  HOUSING_STATUS: {
    REQUIRED: 'validation.housingStatus.required',
  },
  
  MONTHLY_RENT: {
    INVALID: 'validation.monthlyRent.invalid',
    MIN: 'validation.monthlyRent.min',
    MAX: 'validation.monthlyRent.max',
  },
  
  RECEIVING_BENEFITS: {
    REQUIRED: 'validation.receivingBenefits.required',
  },
  
  PREVIOUSLY_APPLIED: {
    REQUIRED: 'validation.previouslyApplied.required',
  },

  // Step 3: Descriptive Information
  FINANCIAL_SITUATION: {
    MIN: 'validation.financialSituation.min',
    MAX: 'validation.financialSituation.max',
    WORD_COUNT: 'validation.financialSituation.wordCount',
  },
  
  EMPLOYMENT_CIRCUMSTANCES: {
    MIN: 'validation.employmentCircumstances.min',
    MAX: 'validation.employmentCircumstances.max',
    WORD_COUNT: 'validation.employmentCircumstances.wordCount',
  },
  
  REASON_FOR_APPLYING: {
    MIN: 'validation.reasonForApplying.min',
    MAX: 'validation.reasonForApplying.max',
    WORD_COUNT: 'validation.reasonForApplying.wordCount',
  },
  
  ADDITIONAL_COMMENTS: {
    MAX: 'validation.additionalComments.max',
  },
  
  AGREE_TO_TERMS: {
    REQUIRED: 'validation.agreeToTerms.required',
  },
  
  CONSENT_TO_DATA_PROCESSING: {
    REQUIRED: 'validation.consentToDataProcessing.required',
  },
  
  ALLOW_CONTACT_FOR_CLARIFICATION: {
    REQUIRED: 'validation.allowContactForClarification.required',
  },
} as const;

// Helper function to get all validation keys as a flat array
export const getAllValidationKeys = (): string[] => {
  const keys: string[] = [];
  
  const addKeys = (obj: any) => {
    Object.values(obj).forEach((value) => {
      if (typeof value === 'string') {
        keys.push(value);
      } else if (typeof value === 'object') {
        addKeys(value);
      }
    });
  };
  
  addKeys(VALIDATION_KEYS);
  return keys;
};