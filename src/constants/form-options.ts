/**
 * Form Options Constants
 * Contains all dropdown options and select values for form fields
 */

// =============================================================================
// COUNTRY OPTIONS
// =============================================================================

export const COUNTRIES = {
  AE: 'AE',
  SA: 'SA', 
  QA: 'QA',
  KW: 'KW',
  BH: 'BH',
  OM: 'OM',
  JO: 'JO',
  LB: 'LB',
  EG: 'EG',
  OTHER: 'OTHER',
} as const;

// =============================================================================
// GENDER OPTIONS
// =============================================================================

export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female', 
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
} as const;

// =============================================================================
// MARITAL STATUS OPTIONS
// =============================================================================

export const MARITAL_STATUS_OPTIONS = {
  SINGLE: 'single',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
  SEPARATED: 'separated',
} as const;

// =============================================================================
// EMPLOYMENT STATUS OPTIONS
// =============================================================================

export const EMPLOYMENT_STATUS_OPTIONS = {
  EMPLOYED_FULL_TIME: 'employed_full_time',
  EMPLOYED_PART_TIME: 'employed_part_time',
  SELF_EMPLOYED: 'self_employed',
  UNEMPLOYED: 'unemployed',
  RETIRED: 'retired',
  STUDENT: 'student',
  DISABLED: 'disabled',
} as const;

// =============================================================================
// HOUSING STATUS OPTIONS
// =============================================================================

export const HOUSING_STATUS_OPTIONS = {
  OWN: 'own',
  RENT: 'rent',
  LIVING_WITH_FAMILY: 'living_with_family',
  HOMELESS: 'homeless',
  OTHER: 'other',
} as const;

// =============================================================================
// BENEFIT TYPES OPTIONS
// =============================================================================

export const BENEFIT_TYPES_OPTIONS = {
  UNEMPLOYMENT: 'unemployment',
  DISABILITY: 'disability',
  HOUSING: 'housing',
  FOOD: 'food',
  MEDICAL: 'medical',
  ELDERLY: 'elderly',
  FAMILY: 'family',
  OTHER: 'other',
} as const;

// =============================================================================
// BOOLEAN OPTIONS
// =============================================================================

export const BOOLEAN_OPTIONS = {
  TRUE: 'true',
  FALSE: 'false',
} as const;

// =============================================================================
// FORM FIELD TYPES
// =============================================================================

export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  PASSWORD: 'password',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  CHECKBOX_GROUP: 'checkbox-group',
  TEXTAREA: 'textarea',
} as const;

// =============================================================================
// FIELD DIRECTIONS
// =============================================================================

export const FIELD_DIRECTIONS = {
  LTR: 'ltr',
  RTL: 'rtl',
  AUTO: 'auto',
} as const;

// =============================================================================
// LTR FIELD TYPES
// =============================================================================

export const LTR_FIELD_TYPES = [
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.TEL,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.DATE,
] as const;

// =============================================================================
// CURRENCY
// =============================================================================

export const CURRENCY = {
  AED: 'AED',
  USD: 'USD',
  DEFAULT: 'AED',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CountryCode = keyof typeof COUNTRIES;
export type GenderOption = typeof GENDER_OPTIONS[keyof typeof GENDER_OPTIONS];
export type MaritalStatusOption = typeof MARITAL_STATUS_OPTIONS[keyof typeof MARITAL_STATUS_OPTIONS];
export type EmploymentStatusOption = typeof EMPLOYMENT_STATUS_OPTIONS[keyof typeof EMPLOYMENT_STATUS_OPTIONS];
export type HousingStatusOption = typeof HOUSING_STATUS_OPTIONS[keyof typeof HOUSING_STATUS_OPTIONS];
export type BenefitTypeOption = typeof BENEFIT_TYPES_OPTIONS[keyof typeof BENEFIT_TYPES_OPTIONS];
export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
export type FieldDirection = typeof FIELD_DIRECTIONS[keyof typeof FIELD_DIRECTIONS];