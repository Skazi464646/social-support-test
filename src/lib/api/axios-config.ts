import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { FormSubmissionError } from './form-submission';

// Extend Axios config to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      endTime?: number;
    };
  }
}

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

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
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        requestId,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR  
// =============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      const requestId = response.config.headers?.['X-Request-ID'];
      console.log(`[API Response] ${response.status} ${response.config.url}`, {
        requestId,
        data: response.data,
         duration: response.config.metadata?.endTime &&
        response.config.metadata?.startTime 
                  ? response.config.metadata.endTime - 
      response.config.metadata.startTime 
                  : undefined,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const requestId = error.config?.headers?.['X-Request-ID'];
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.response?.status || 'Network'} ${error.config?.url}`, {
        requestId,
        error: error.message,
        response: error.response?.data,
      });
    }

    // Handle different HTTP status codes
    if (error.response) {
      const { status, statusText, data } = error.response;
      
      switch (status) {
        case 400:
          throw new FormSubmissionError(
            'VALIDATION_ERROR',
            (data as any)?.message || 'Invalid request data',
            (data as any)?.field,
            { statusCode: status, details: data }
          );
          
        case 401:
          throw new FormSubmissionError(
            'UNAUTHORIZED',
            'Authentication required. Please log in and try again.',
            undefined,
            { statusCode: status }
          );
          
        case 403:
          throw new FormSubmissionError(
            'FORBIDDEN',
            'You do not have permission to perform this action.',
            undefined,
            { statusCode: status }
          );
          
        case 404:
          throw new FormSubmissionError(
            'SERVICE_NOT_FOUND',
            'Service temporarily unavailable. Please try again later.',
            undefined,
            { statusCode: status }
          );
          
        case 409:
          throw new FormSubmissionError(
            'CONFLICT',
            (data as any)?.message || 'A conflict occurred with your request.',
            (data as any)?.field,
            { statusCode: status, details: data }
          );
          
        case 422:
          throw new FormSubmissionError(
            'VALIDATION_ERROR',
            (data as any)?.message || 'Validation failed for submitted data.',
            (data as any)?.field,
            { statusCode: status, details: data }
          );
          
        case 429:
          throw new FormSubmissionError(
            'RATE_LIMITED',
            'Too many requests. Please wait a moment and try again.',
            undefined,
            { statusCode: status, retryAfter: error.response.headers['retry-after'] }
          );
          
        case 500:
          throw new FormSubmissionError(
            'SERVER_ERROR',
            'Server error occurred. Please try again in a moment.',
            undefined,
            { statusCode: status }
          );
          
        case 502:
        case 503:
        case 504:
          throw new FormSubmissionError(
            'SERVICE_UNAVAILABLE',
            'Service temporarily unavailable. Please try again later.',
            undefined,
            { statusCode: status }
          );
          
        default:
          throw new FormSubmissionError(
            'HTTP_ERROR',
            `Request failed with status ${status}: ${statusText}`,
            undefined,
            { statusCode: status, statusText }
          );
      }
    }
    
    // Handle network errors (no response received)
    if (error.request) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new FormSubmissionError(
          'SUBMISSION_TIMEOUT',
          'Request timed out. Please check your connection and try again.',
          undefined,
          { code: error.code }
        );
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new FormSubmissionError(
          'NETWORK_ERROR',
          'Network connection failed. Please check your internet connection.',
          undefined,
          { code: error.code }
        );
      }
      
      throw new FormSubmissionError(
        'CONNECTION_ERROR',
        'Unable to connect to the server. Please try again.',
        undefined,
        { code: error.code, message: error.message }
      );
    }
    
    // Handle request setup errors
    throw new FormSubmissionError(
      'REQUEST_ERROR',
      'Failed to set up the request. Please try again.',
      undefined,
      { message: error.message }
    );
  }
);

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Base delay in milliseconds

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
    
    if (import.meta.env.DEV) {
      console.log(`[API Retry] Retrying request in ${delay}ms. Retries left: ${retries - 1}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(requestFn, retries - 1);
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