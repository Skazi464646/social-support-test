// UI messages, labels, and text constants

export const AI_MESSAGES = {
  // AI Assist Modal
  modal: {
    closeAriaLabel: 'Close modal',
    generateButton: '✨ Generate',
    generating: 'Generating...',
    regenerateTitle: 'Generate another suggestion',
    toggleExamples: (show: boolean, count: number) => 
      `${show ? 'Hide' : 'Show'} examples (${count})`,
    generatePrompt: 'Click "Generate" for AI suggestions',
    editPlaceholder: 'Edit your text here or generate AI suggestions for improvements...',
    selectPlaceholder: 'Select a suggestion to edit it here...',
  },
  
  // AI Assist Button
  button: {
    generating: 'Generating suggestion...',
    defaultTitle: 'Get AI writing assistance',
    useSampleTitle: 'Use a sample response',
  },
  
  // Error Messages
  errors: {
    unavailable: 'AI assistance is not available. Please check your configuration.',
    rateLimitReached: (seconds: number) => 
      `Rate limit reached. Please wait ${seconds} seconds before trying again.`,
    unknownError: 'Unknown error occurred',
    failedExamples: 'Failed to generate examples',
    rateLimitAlert: "You're making requests too quickly. Please wait a moment and try again.",
    requestCancelled: 'Request was cancelled',
  },
  
  // Relevancy Feedback
  relevancy: {
    notRelevant: (reason: string, fieldName: string) => 
      `Your input is not relevant to this context. ${reason}. Please provide more relevant information about your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
    notRelevantExamples: (reason: string, fieldName: string) => 
      `Not relevant to this context. ${reason}. Please try to provide more relevant information about your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
  },
  
  // Character Count
  characterCount: {
    min: (current: number, min: number) => `(min: ${min})`,
    format: (current: number, max: number) => `${current}/${max}`,
  },
} as const;

export const FORM_MESSAGES = {
  // Common
  required: 'This field is required',
  requiredStar: '*',
  
  // Submission
  submission: {
    success: 'Application submitted successfully. You will receive a confirmation email shortly.',
    processing: 'Processing time',
    nextSteps: 'Next Steps',
    reference: 'Please save your application ID for future reference',
    startNew: 'Start New Application',
    continue: 'Continue',
  },
  
  // Actions
  actions: {
    copied: 'Copied',
    copy: 'Copy',
  },
} as const;

export const ERROR_TITLES = {
  formValidation: 'Form Validation Error',
  submissionTimeout: 'Submission Timeout',
  networkError: 'Network Error',
  serverError: 'Server Error',
  submissionCancelled: 'Submission Cancelled',
  unexpectedError: 'Unexpected Error',
} as const;

export const ERROR_MESSAGES = {
  // Validation
  validation: {
    checkForm: 'Please check your form data and try again.',
    failed: (message: string) => `Validation failed: ${message}`,
    invalidData: 'Invalid form data',
  },
  
  // Submission
  submission: {
    failed: 'Application submission failed',
    timeout: 'Submission timed out. Please try again.',
    timeoutLong: 'Your submission is taking longer than expected. Please try again.',
    cancelled: 'Submission was cancelled',
  },
  
  // Network
  network: {
    error: 'Network error. Please check your connection and try again.',
    errorShort: 'Please check your internet connection and try again.',
    failed: 'Network connection failed. Please check your internet connection.',
    timeout: 'Request timed out. Please check your connection and try again.',
  },
  
  // Server
  server: {
    error: 'Server error occurred. Please try again in a moment.',
    unavailable: 'Service temporarily unavailable. Please try again later.',
    temporarilyUnavailable: 'Our servers are temporarily unavailable. Please try again later.',
    authRequired: 'Authentication required. Please log in and try again.',
    forbidden: 'You do not have permission to perform this action.',
    conflict: (message?: string) => message || 'A conflict occurred with your request.',
    validationFailed: (message?: string) => message || 'Validation failed for submitted data.',
    rateLimited: 'Too many requests. Please wait a moment and try again.',
    httpError: (status: number, statusText: string) => 
      `Request failed with status ${status}: ${statusText}`,
  },
  
  // Connection
  connection: {
    error: 'Unable to connect to the server. Please try again.',
    requestError: 'Failed to set up the request. Please try again.',
  },
  
  // Generic
  unknown: 'An unexpected error occurred. Please try again or contact support.',
  unknownDuringSubmission: 'An unexpected error occurred during submission. Please try again.',
} as const;

export const ERROR_ACTIONS = {
  reviewForm: 'Review Form',
  retrySubmission: 'Retry Submission',
  retryLater: 'Retry Later',
  contactSupport: 'Contact Support',
} as const;

export const ARIA_LABELS = {
  closeNotification: 'Close notification',
  progressNav: 'Application progress',
} as const;

export const PROGRESS_STATUS = {
  current: 'Current step',
  completed: 'Completed step',
  upcoming: 'Upcoming step',
} as const;

export const SUBMISSION_METADATA = {
  version: '1.0.0',
  testMode: true,
} as const;

export const MOCK_SUBMISSION = {
  networkDelay: 2000,
  failureRate: 0.1,
} as const;

