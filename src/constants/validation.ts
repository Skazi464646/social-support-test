/**
 * Validation Constants
 * Contains all validation-related constants for form fields
 */

// =============================================================================
// STRING LENGTH CONSTRAINTS
// =============================================================================

export const STRING_LENGTH = {
  MIN: {
    NAME: 2,
    CITY: 2,
    STATE: 2,
    ADDRESS: 10,
    EMAIL: 5,
    PHONE: 8,
    OCCUPATION: 2,
    EMPLOYER: 2,
    DESCRIPTION_SHORT: 50,
    WORD_COUNT: 10,
  },
  MAX: {
    NAME: 100,
    CITY: 50,
    STATE: 50,
    ADDRESS: 200,
    EMAIL: 100,
    PHONE: 15,
    OCCUPATION: 100,
    EMPLOYER: 100,
    DESCRIPTION_MEDIUM: 1000,
    DESCRIPTION_LONG: 2000,
  }
} as const;

// =============================================================================
// NUMERIC CONSTRAINTS
// =============================================================================

export const NUMERIC_LIMITS = {
  AGE: {
    MIN: 18,
  },
  DEPENDENTS: {
    MIN: 0,
    MAX: 20,
  },
  INCOME: {
    MIN: 0,
    MAX: 1000000,
  },
  EXPENSES: {
    MIN: 0,
    MAX: 1000000,
  },
  SAVINGS: {
    MIN: 0,
    MAX: 10000000,
  },
  DEBT: {
    MIN: 0,
    MAX: 10000000,
  },
  RENT: {
    MIN: 0,
    MAX: 100000,
  },
} as const;

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const REGEX_PATTERNS = {
  NATIONAL_ID: /^[0-9]{10}$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  NAME: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
  CITY_STATE: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
  POSTAL_CODE: /^[0-9]{5}$/,
} as const;

// =============================================================================
// VALIDATION MESSAGES
// =============================================================================

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  TOO_SHORT: 'Too short',
  TOO_LONG: 'Too long',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number format',
  INVALID_DATE: 'Invalid date',
  FUTURE_DATE: 'Date cannot be in the future',
  AGE_TOO_YOUNG: 'You must be at least 18 years old',
  NEGATIVE_NUMBER: 'Cannot be negative',
  EXCEEDS_LIMIT: 'Exceeds maximum allowed value',
  INVALID_CHECKSUM: 'Invalid checksum',
} as const;

// =============================================================================
// FIELD SPECIFIC LIMITS
// =============================================================================

export const FIELD_LIMITS = {
  NATIONAL_ID: {
    LENGTH: 10,
  },
  POSTAL_CODE: {
    LENGTH: 5,
  },
  TEXTAREA: {
    DEFAULT_ROWS: 4,
    MAX_ROWS: 10,
  },
} as const;

// =============================================================================
// FORM STEP VALIDATION
// =============================================================================

export const FORM_STEPS = {
  TOTAL: 3,
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type StringLengthKey = keyof typeof STRING_LENGTH.MIN | keyof typeof STRING_LENGTH.MAX;
export type NumericLimitKey = keyof typeof NUMERIC_LIMITS;
export type RegexPatternKey = keyof typeof REGEX_PATTERNS;
export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;