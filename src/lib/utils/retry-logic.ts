/**
 * Retry Logic with Exponential Backoff + Jitter
 * Module 5 - Step 2: Enhanced Security Features
 */

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitterFactor?: number;
  retryCondition?: (error: any) => boolean;
}

interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

/**
 * Retry function with exponential backoff and jitter
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    jitterFactor = 0.1,
    retryCondition = defaultRetryCondition,
  } = options;

  const startTime = Date.now();
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      return {
        success: true,
        result,
        attempts: attempt,
        totalTime: Date.now() - startTime,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry if condition says no or if it's the last attempt
      if (!retryCondition(lastError) || attempt === maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      const jitter = exponentialDelay * jitterFactor * Math.random();
      const delay = exponentialDelay + jitter;
      
      console.log(`[RetryLogic] Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
      console.log(`[RetryLogic] Error:`, lastError.message);
      
      await sleep(delay);
    }
  }
  
  return {
    success: false,
    error: lastError!,
    attempts: maxAttempts,
    totalTime: Date.now() - startTime,
  };
}

/**
 * Default retry condition - retry on network errors and 5xx status codes
 */
function defaultRetryCondition(error: any): boolean {
  // Don't retry if request was aborted
  if (error.name === 'AbortError') {
    return false;
  }
  
  // Don't retry on 4xx client errors (except 429 rate limit)
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return error.response.status === 429; // Retry on rate limit
  }
  
  // Retry on network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
    return true;
  }
  
  // Retry on 5xx server errors
  if (error.response?.status >= 500) {
    return true;
  }
  
  // Retry on timeout errors
  if (error.message?.includes('timeout')) {
    return true;
  }
  
  return false;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Specialized retry for OpenAI API calls
 */
export async function retryOpenAICall<T>(
  operation: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  const result = await retryWithBackoff(operation, {
    maxAttempts,
    baseDelay: 1000,
    maxDelay: 8000,
    jitterFactor: 0.1,
    retryCondition: (error) => {
      // Don't retry if request was aborted
      if (error.name === 'AbortError') {
        return false;
      }
      
      // Retry on rate limits
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        return true;
      }
      
      // Retry on server errors
      if (error.message?.includes('500') || error.message?.includes('502') || 
          error.message?.includes('503') || error.message?.includes('504')) {
        return true;
      }
      
      // Retry on network timeouts
      if (error.message?.includes('timeout') || error.message?.includes('ECONNABORTED')) {
        return true;
      }
      
      return false;
    },
  });
  
  if (result.success) {
    return result.result!;
  }
  
  throw result.error;
}