/**
 * AI Service Types
 * Module 5 - Step 1: AI Configuration & Service Foundation
 */

/**
 * Supported languages for AI assistance
 */
export type SupportedLanguage = 'en' | 'ar';

/**
 * AI assistance request payload
 */
export interface AIAssistRequest {
  fieldName: string;
  currentValue: string;
  userContext: {
    step1?: Record<string, any>;
    step2?: Record<string, any>;
    step3?: Record<string, any>;
  };
  language: SupportedLanguage;
  assistanceType?: 'suggestion' | 'completion' | 'improvement';
}

/**
 * AI assistance response
 */
export interface AIAssistResponse {
  suggestion: string;
  confidence: number;
  reasoning?: string;
  alternatives?: string[];
  metadata: {
    requestId: string;
    timestamp: number;
    modelUsed: string;
    tokensUsed: number;
  };
}

/**
 * AI service error types
 */
export interface AIServiceError {
  code: 'RATE_LIMIT' | 'INVALID_REQUEST' | 'SERVICE_UNAVAILABLE' | 'CONTENT_FILTERED' | 'TIMEOUT';
  message: string;
  retryAfter?: number;
  details?: Record<string, any>;
}

/**
 * AI assistance context for form fields
 */
export interface FieldContext {
  fieldType: 'text' | 'textarea' | 'select' | 'number';
  fieldName: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required: boolean;
  validation?: {
    minLength?: number;
    pattern?: string;
    customRules?: string[];
  };
}

/**
 * AI suggestion generation options
 */
export interface SuggestionOptions {
  includeAlternatives?: boolean;
  maxAlternatives?: number;
  contextWindow?: 'current_step' | 'all_steps' | 'specific_fields';
  tone?: 'formal' | 'professional' | 'conversational';
  length?: 'brief' | 'detailed' | 'comprehensive';
}

/**
 * Streaming response for real-time assistance
 */
export interface AIStreamResponse {
  type: 'delta' | 'completion' | 'error';
  content: string;
  finished: boolean;
  metadata?: {
    requestId: string;
    chunkIndex: number;
    totalChunks?: number;
  };
}

/**
 * AI service usage statistics
 */
export interface AIUsageStats {
  requestsToday: number;
  requestsThisMonth: number;
  tokensUsedToday: number;
  tokensUsedThisMonth: number;
  averageResponseTime: number;
  successRate: number;
}

/**
 * Request tracking for rate limiting and analytics
 */
export interface AIRequestTracker {
  userId?: string;
  sessionId: string;
  requestId: string;
  timestamp: number;
  fieldName: string;
  requestType: 'suggestion' | 'completion' | 'improvement';
  tokensUsed: number;
  responseTime: number;
  success: boolean;
  error?: AIServiceError;
}