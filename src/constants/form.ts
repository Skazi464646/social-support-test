// Form-related constants

export const FORM_LIMITS = {
  step3: {
    minChars: 50,
    maxChars: 2000,
    minWords: 10,
  },
  additionalComments: {
    maxChars: 1000,
  },
  inputDefaults: {
    textareaMin: 50,
    textareaMax: 1000,
    inputMax: 100,
  },
} as const;

export const FAMILY_LIMITS = {
  dependentsMax: 20,
} as const;

export const FINANCIAL_LIMITS = {
  monthlyIncomeMax: 1_000_000,
  monthlyExpensesMax: 1_000_000,
  totalSavingsMax: 10_000_000,
  totalDebtMax: 10_000_000,
  monthlyRentMax: 100_000,
} as const;

export const API_DEFAULTS = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  requestTimeoutMs: 30_000,
  maxRetries: 3,
  retryBaseDelayMs: 10000,
} ;


