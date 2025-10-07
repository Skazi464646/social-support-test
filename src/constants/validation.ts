// Validation constants and regexes

export const VALIDATION_LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 100 },
  phone: { min: 8, max: 15 },
  address: { min: 10, max: 200 },
  city: { min: 2, max: 50 },
  state: { min: 2, max: 50 },
  postalCode: { length: 5 },
} as const;

export const VALIDATION_REGEX = {
  name: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
  numbersOnly10: /^[0-9]{10}$/,
  cityOrState: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
  phoneIntl: /^[\+]?[^\D0][\d]{0,15}$/,
} as const;


