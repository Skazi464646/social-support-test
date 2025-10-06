/**
 * API Constants
 * Contains all API-related constants for endpoints, timeouts, and configurations
 */

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// =============================================================================
// API TIMEOUTS (in milliseconds)
// =============================================================================

export const API_TIMEOUTS = {
  DEFAULT: 30000,      // 30 seconds
  UPLOAD: 60000,       // 60 seconds
  AI_REQUEST: 45000,   // 45 seconds
  QUICK_REQUEST: 10000, // 10 seconds
} as const;

// =============================================================================
// RETRY CONFIGURATION
// =============================================================================

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,    // 1 second
  MAX_DELAY: 10000,       // 10 seconds
  EXPONENTIAL_BASE: 2,
} as const;

// =============================================================================
// REQUEST HEADERS
// =============================================================================

export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_REQUEST_ID: 'X-Request-ID',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
} as const;

// =============================================================================
// CONTENT TYPES
// =============================================================================

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
} as const;

// =============================================================================
// API ENDPOINTS
// =============================================================================

export const API_ENDPOINTS = {
  FORM_SUBMISSION: '/api/form/submit',
  AI_SUGGESTIONS: '/api/ai/suggestions',
  AI_EXAMPLES: '/api/ai/examples',
  AI_RELEVANCY: '/api/ai/relevancy',
  VALIDATION: '/api/validation',
  UPLOAD: '/api/upload',
  HEALTH: '/api/health',
} as const;

// =============================================================================
// HTTP METHODS
// =============================================================================

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

// =============================================================================
// ERROR CODES
// =============================================================================

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'ECONNABORTED',
  CANCELLED_ERROR: 'CANCELLED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000,     // 5 minutes
  AI_CACHE_TTL: 900000,    // 15 minutes
  LONG_CACHE_TTL: 3600000, // 1 hour
} as const;

// =============================================================================
// RATE LIMITING
// =============================================================================

export const RATE_LIMITS = {
  AI_REQUESTS_PER_MINUTE: 10,
  FORM_SUBMISSIONS_PER_HOUR: 5,
  GENERAL_REQUESTS_PER_MINUTE: 60,
} as const;

// =============================================================================
// FILE UPLOAD LIMITS
// =============================================================================

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10485760,    // 10MB
  MAX_FILES: 5,
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
  ],
} as const;

// =============================================================================
// OPENAI CONFIGURATION
// =============================================================================

export const OPENAI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
} as const;

// =============================================================================
// REQUEST ID GENERATION
// =============================================================================

export const REQUEST_ID = {
  PREFIX: 'req_',
  LENGTH: 16,
  CHARSET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
} as const;

// =============================================================================
// MOCK API DELAYS (for development)
// =============================================================================

export const MOCK_DELAYS = {
  FORM_SUBMIT: 2000,      // 2 seconds
  AI_SUGGESTION: 3000,    // 3 seconds
  AI_EXAMPLES: 1500,      // 1.5 seconds
  VALIDATION: 500,        // 0.5 seconds
} as const;

// =============================================================================
// ENVIRONMENT VARIABLES
// =============================================================================

export const ENV_VARS = {
  OPENAI_API_KEY: 'VITE_OPENAI_API_KEY',
  API_BASE_URL: 'VITE_API_BASE_URL',
  ENVIRONMENT: 'VITE_ENVIRONMENT',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];