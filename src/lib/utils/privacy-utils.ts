/**
 * Privacy and Security Utilities
 * Module 5 - Step 2: Enhanced Security Features
 */

/**
 * PII patterns to redact from logs
 */
const PII_PATTERNS = [
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Phone numbers (various formats)
  /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
  // National ID patterns (10 digits)
  /\b\d{10}\b/g,
  // Credit card patterns
  /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g,
  // SSN patterns
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
];

/**
 * Redact PII from text for logging
 */
export function redactPII(text: string): string {
  let redacted = text;
  
  for (const pattern of PII_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }
  
  return redacted;
}

/**
 * Sanitize object for logging by redacting PII
 */
export function sanitizeForLogging(obj: any): any {
  if (typeof obj === 'string') {
    return redactPII(obj);
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLogging(item));
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip sensitive fields entirely
    if (isSensitiveField(key)) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    sanitized[key] = sanitizeForLogging(value);
  }
  
  return sanitized;
}

/**
 * Check if field name indicates sensitive data
 */
function isSensitiveField(fieldName: string): boolean {
  const sensitiveFields = [
    'password',
    'token',
    'key',
    'secret',
    'nationalId',
    'ssn',
    'creditCard',
    'apiKey',
    'authorization',
  ];
  
  const lowerField = fieldName.toLowerCase();
  return sensitiveFields.some(sensitive => lowerField.includes(sensitive));
}

/**
 * Generate session ID for request tracking
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `session_${timestamp}_${random}`;
}

/**
 * Generate request ID for tracking
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `req_${timestamp}_${random}`;
}

/**
 * Validate that text doesn't contain obvious PII before sending to AI
 */
export function validateInputSafety(text: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for email addresses
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    issues.push('Email address detected');
  }
  
  // Check for phone numbers
  if (/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(text)) {
    issues.push('Phone number detected');
  }
  
  // Check for potential ID numbers
  if (/\b\d{9,}\b/.test(text)) {
    issues.push('Potential ID number detected');
  }
  
  return {
    safe: issues.length === 0,
    issues,
  };
}