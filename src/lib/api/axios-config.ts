import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { FormSubmissionError } from './form-submission';
import { API_DEFAULTS, ERROR_MESSAGES } from '@/constants';

// Extend Axios config to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      endTime?: number;
      retryCount?: number;
      isRetrying?: boolean;
    };
  }
}

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

const API_BASE_URL = API_DEFAULTS.baseUrl;
const REQUEST_TIMEOUT = API_DEFAULTS.requestTimeoutMs; // 30 seconds

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request ID for tracking
    const requestId = crypto.randomUUID();
    config.headers.set('X-Request-ID', requestId);
    config.headers.set('X-Timestamp', new Date().toISOString());

    // Log requests in development
  
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR  
// =============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development

    return response;
  },
  async (error: AxiosError) => {
    const requestId = error.config?.headers?.['X-Request-ID'];
    const originalRequest = error.config;
    
    // Initialize retry count if not present
    if (originalRequest && !originalRequest.metadata) {
      originalRequest.metadata = { startTime: Date.now(), retryCount: 0 };
    }
    
    // Convert error to FormSubmissionError first
    const formError = convertToFormSubmissionError(error);
    
    // Check if we should retry
    if (originalRequest && shouldRetryRequest(formError, originalRequest)) {
      const retryCount = (originalRequest.metadata?.retryCount || 0) + 1;
      originalRequest.metadata = {
        ...originalRequest.metadata,
        retryCount,
        isRetrying: true,
        startTime: Date.now(),
      };
      
      // Calculate retry delay
      const delay = calculateRetryDelay(formError, retryCount);
      
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      try {
        return await apiClient.request(originalRequest);
      } catch (retryError) {
        // If retry fails, continue to error handling below
        if (import.meta.env.DEV) {
          console.error(`[API Retry Failed] Attempt ${retryCount}/${MAX_RETRIES}`, {
            requestId,
            error: retryError,
          });
        }
        // Let the retry fail naturally and be handled by next interceptor invocation
        throw retryError;
      }
    }
    
    // =============================================================================
    // ERROR HANDLING (No retry or max retries exceeded)
    // =============================================================================
    
    throw formError;
  }
);

// =============================================================================
// HELPER FUNCTIONS FOR RETRY LOGIC
// =============================================================================

/**
 * Convert Axios error to FormSubmissionError
 */
function convertToFormSubmissionError(error: AxiosError): FormSubmissionError {
  // Handle different HTTP status codes
  if (error.response) {
    const { status, statusText, data } = error.response;
    
    switch (status) {
      case 400:
        return new FormSubmissionError(
          'VALIDATION_ERROR',
          (data as any)?.message || 'Invalid request data',
          (data as any)?.field,
          { statusCode: status, details: data }
        );
        
      case 401:
        return new FormSubmissionError(
          'UNAUTHORIZED',
          ERROR_MESSAGES.server.authRequired,
          undefined,
          { statusCode: status }
        );
        
      case 403:
        return new FormSubmissionError(
          'FORBIDDEN',
          ERROR_MESSAGES.server.forbidden,
          undefined,
          { statusCode: status }
        );
        
      case 404:
        return new FormSubmissionError(
          'SERVICE_NOT_FOUND',
          ERROR_MESSAGES.server.unavailable,
          undefined,
          { statusCode: status }
        );
        
      case 409:
        return new FormSubmissionError(
          'CONFLICT',
          ERROR_MESSAGES.server.conflict((data as any)?.message),
          (data as any)?.field,
          { statusCode: status, details: data }
        );
        
      case 422:
        return new FormSubmissionError(
          'VALIDATION_ERROR',
          ERROR_MESSAGES.server.validationFailed((data as any)?.message),
          (data as any)?.field,
          { statusCode: status, details: data }
        );
        
      case 429:
        return new FormSubmissionError(
          'RATE_LIMITED',
          ERROR_MESSAGES.server.rateLimited,
          undefined,
          { statusCode: status, retryAfter: error.response.headers['retry-after'] }
        );
        
      case 500:
        return new FormSubmissionError(
          'SERVER_ERROR',
          ERROR_MESSAGES.server.error,
          undefined,
          { statusCode: status }
        );
        
      case 502:
      case 503:
      case 504:
        return new FormSubmissionError(
          'SERVICE_UNAVAILABLE',
          ERROR_MESSAGES.server.unavailable,
          undefined,
          { statusCode: status }
        );
        
      default:
        return new FormSubmissionError(
          'HTTP_ERROR',
          ERROR_MESSAGES.server.httpError(status, statusText),
          undefined,
          { statusCode: status, statusText }
        );
    }
  }
  
  // Handle network errors (no response received)
  if (error.request) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new FormSubmissionError(
        'SUBMISSION_TIMEOUT',
        ERROR_MESSAGES.network.timeout,
        undefined,
        { code: error.code }
      );
    }
    
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return new FormSubmissionError(
        'NETWORK_ERROR',
        ERROR_MESSAGES.network.failed,
        undefined,
        { code: error.code }
      );
    }
    
    return new FormSubmissionError(
      'CONNECTION_ERROR',
      ERROR_MESSAGES.connection.error,
      undefined,
      { code: error.code, message: error.message }
    );
  }
  
  // Handle request setup errors
  return new FormSubmissionError(
    'REQUEST_ERROR',
    ERROR_MESSAGES.connection.requestError,
    undefined,
    { message: error.message }
  );
}

/**
 * Determine if request should be retried
 */
function shouldRetryRequest(
  error: FormSubmissionError,
  config: InternalAxiosRequestConfig
): boolean {
  // Don't retry if max retries exceeded
  const retryCount = config.metadata?.retryCount || 0;
  if (retryCount >= MAX_RETRIES) {
    return false;
  }
  
  // Only retry specific error types
  const retryableErrors = [
    'SUBMISSION_TIMEOUT',
    'NETWORK_ERROR',
    'CONNECTION_ERROR',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMITED',
  ];
  
  return retryableErrors.includes(error.code);
}

/**
 * Calculate delay before retry with exponential backoff
 */
function calculateRetryDelay(
  error: FormSubmissionError,
  retryCount: number
): number {
  // For rate limiting, use retry-after header if available
  if (error.code === 'RATE_LIMITED' && error.details?.retryAfter) {
    return parseInt(error.details.retryAfter as string) * 1000;
  }
  
  // Exponential backoff: delay * 2^(retryCount - 1)
  return RETRY_DELAY * Math.pow(2, retryCount - 1);
}

// =============================================================================
// REQUEST/RESPONSE TIMING MIDDLEWARE
// =============================================================================

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.metadata) {
      response.config.metadata.endTime = Date.now();
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.config?.metadata) {
      error.config.metadata.endTime = Date.now();
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// =============================================================================

const MAX_RETRIES = API_DEFAULTS.maxRetries;
const RETRY_DELAY = API_DEFAULTS.retryBaseDelayMs; // Base delay in milliseconds

export const retryRequest = async (
  requestFn: () => Promise<AxiosResponse>,
  retries = MAX_RETRIES
): Promise<AxiosResponse> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Only retry for specific error types
    if (error instanceof FormSubmissionError) {
      const retryableErrors = [
        'SUBMISSION_TIMEOUT',
        'NETWORK_ERROR',
        'CONNECTION_ERROR',
        'SERVER_ERROR',
        'SERVICE_UNAVAILABLE',
      ];
      
      if (!retryableErrors.includes(error.code)) {
        throw error;
      }
    }
    
    // Calculate exponential backoff delay
    const delay = RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
    
 
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(requestFn, Number(retries) - 1);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: FormSubmissionError): boolean => {
  const retryableErrors = [
    'SUBMISSION_TIMEOUT',
    'NETWORK_ERROR', 
    'CONNECTION_ERROR',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMITED',
  ];
  
  return retryableErrors.includes(error.code);
};

/**
 * Get retry delay for rate limiting
 */
export const getRetryDelay = (error: FormSubmissionError): number => {
  if (error.code === 'RATE_LIMITED' && error.details?.retryAfter) {
    return parseInt(error.details.retryAfter as string) * 1000;
  }
  
  return RETRY_DELAY;
};

export default apiClient;