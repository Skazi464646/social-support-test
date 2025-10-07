# Axios Interceptor Enhancements - Implementation Summary

## 📋 Overview

This document details the enhancements made to the `apiClient` axios configuration to add **automatic retry logic** and improve **global error handling**.

---

## 🎯 Objectives Achieved

### ✅ 1. Automatic Retry Failed Requests
- **Previously**: Retry logic existed as a separate `retryRequest()` function that had to be manually wrapped around each API call
- **Now**: All API requests made through `apiClient` automatically retry on transient failures
- **Benefit**: Improved UX by handling network issues transparently without code changes in calling code

### ✅ 2. Enhanced Global Error Handling  
- **Maintained**: All existing comprehensive error handling (HTTP status codes, network errors, etc.)
- **Enhanced**: Better error logging with retry attempt tracking
- **Added**: Metadata tracking for retry counts and timing

---

## 🔧 Technical Implementation

### Enhanced Metadata Tracking

```typescript
interface InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;        // Request start timestamp
    endTime?: number;         // Request end timestamp  
    retryCount?: number;      // Number of retry attempts
    isRetrying?: boolean;     // Whether request is being retried
  };
}
```

### Automatic Retry Flow

```
┌─────────────────┐
│  API Request    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Request Error  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Convert to               │
│ FormSubmissionError      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐      NO     ┌─────────────────┐
│ Should Retry?            │─────────────▶│  Throw Error    │
│ - Check retryable errors │             └─────────────────┘
│ - Check max retries      │
└────────┬─────────────────┘
         │ YES
         ▼
┌──────────────────────────┐
│ Calculate Delay          │
│ (Exponential Backoff)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Wait & Retry Request     │
└────────┬─────────────────┘
         │
         └───────┐
                 │
                 ▼
         ┌───────────────┐
         │  Success or   │
         │  Max Retries  │
         └───────────────┘
```

---

## 📊 Configuration

### Retry Parameters

```typescript
// From src/constants/form.ts
export const API_DEFAULTS = {
  baseUrl: '/api',
  requestTimeoutMs: 30_000,    // 30 seconds
  maxRetries: 3,               // Maximum 3 retry attempts
  retryBaseDelayMs: 10_000,    // 10 seconds base delay
};
```

### Retryable Error Types

The following error types trigger automatic retry:

1. **SUBMISSION_TIMEOUT** - Request timeout
2. **NETWORK_ERROR** - Network connection failure
3. **CONNECTION_ERROR** - Unable to connect to server
4. **SERVER_ERROR** - HTTP 500 Internal Server Error
5. **SERVICE_UNAVAILABLE** - HTTP 502, 503, 504 errors
6. **RATE_LIMITED** - HTTP 429 Too Many Requests (with smart delay)

### Non-Retryable Errors

These errors are **NOT** retried (fail immediately):

- **VALIDATION_ERROR** (400, 422) - Client data issue
- **UNAUTHORIZED** (401) - Authentication required
- **FORBIDDEN** (403) - Permission denied
- **SERVICE_NOT_FOUND** (404) - Endpoint not found
- **CONFLICT** (409) - Data conflict

---

## 🚀 Key Features

### 1. Exponential Backoff

Each retry waits progressively longer:

```typescript
Retry 1: 10 seconds  (10s × 2^0)
Retry 2: 20 seconds  (10s × 2^1)
Retry 3: 40 seconds  (10s × 2^2)
```

### 2. Smart Rate Limiting

When receiving HTTP 429 (Rate Limited):
- Respects `Retry-After` header from server
- Falls back to exponential backoff if header not present

### 3. Development Logging

Comprehensive console logs in development mode:

```typescript
// Request initiated
[API Request] POST /applications/submit

// Error occurred
[API Error] 503 /applications/submit { 
  requestId: '...', 
  retryCount: 0 
}

// Retry attempt
[API Retry] Attempt 1/3 for /applications/submit { 
  delayMs: 10000,
  errorCode: 'SERVICE_UNAVAILABLE' 
}

// Retry failed
[API Retry Failed] Attempt 1/3

// Final success (after retry)
[API Response] 200 /applications/submit { 
  retryCount: 1,
  duration: 12340 
}
```

### 4. Request Tracking

Every request gets unique tracking:
- **X-Request-ID**: UUID for request correlation
- **X-Timestamp**: ISO timestamp
- **Retry metadata**: Attempt count and timing

---

## 📖 Usage Examples

### Example 1: Basic API Call (Auto-Retry)

```typescript
// Previously required manual wrapping:
const response = await retryRequest(() => 
  apiClient.post('/applications/submit', data)
);

// Now works automatically:
const response = await apiClient.post('/applications/submit', data);
// Automatically retries on transient failures!
```

### Example 2: Error Handling

```typescript
try {
  const response = await apiClient.post('/applications/submit', formData);
  console.log('Success:', response.data);
} catch (error) {
  if (error instanceof FormSubmissionError) {
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
    console.error('Field:', error.field);
    console.error('Details:', error.details);
  }
}
```

### Example 3: Checking Retry Attempts

```typescript
try {
  const response = await apiClient.post('/api/data', payload);
  
  // Check if request was retried
  const retryCount = response.config.metadata?.retryCount || 0;
  if (retryCount > 0) {
    console.log(`Request succeeded after ${retryCount} retries`);
  }
} catch (error) {
  // Error thrown after max retries exceeded
}
```

---

## 🔄 Backward Compatibility

### Legacy `retryRequest()` Function

The original `retryRequest()` wrapper function is **still available** and works as before:

```typescript
// Still works for explicit control
export const retryRequest = async (
  requestFn: () => Promise<AxiosResponse>,
  retries = MAX_RETRIES
): Promise<AxiosResponse> => { ... }

// Can still be used:
const response = await retryRequest(() => 
  apiClient.get('/status')
);
```

### Migration Path

**No code changes required!** Existing code using `retryRequest()` will:
1. Work exactly as before
2. Benefit from the new interceptor enhancements
3. Can be simplified by removing `retryRequest()` wrapper at your convenience

---

## 🧪 Testing Considerations

### Testing Retry Logic

```typescript
// Mock a transient failure
mockServer.use(
  rest.post('/api/submit', (req, res, ctx) => {
    const attempt = parseInt(req.headers.get('X-Retry-Count') || '0');
    
    // Fail first 2 attempts, succeed on 3rd
    if (attempt < 2) {
      return res(ctx.status(503), ctx.json({ error: 'Service Unavailable' }));
    }
    
    return res(ctx.status(200), ctx.json({ success: true }));
  })
);
```

### Disable Retries in Tests

```typescript
// Create test client without retries
const testClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  // Use basic interceptors only, skip retry logic
});
```

---

## 📈 Performance Impact

### Positive Impacts
- ✅ Reduced user-facing errors from transient failures
- ✅ Better reliability without user intervention
- ✅ Transparent handling of network hiccups

### Considerations
- ⚠️ Increased latency on failed requests (up to ~70s for 3 retries)
- ⚠️ More API calls for temporary failures
- ✅ Mitigated by only retrying specific error types
- ✅ Configurable via `API_DEFAULTS.maxRetries`

---

## 🛠️ Configuration Options

### Adjust Retry Behavior

Edit `src/constants/form.ts`:

```typescript
export const API_DEFAULTS = {
  maxRetries: 2,              // Reduce retries
  retryBaseDelayMs: 5_000,    // Faster retry (5s base)
};
```

### Disable Retries

Set `maxRetries: 0` to disable automatic retries:

```typescript
export const API_DEFAULTS = {
  maxRetries: 0,  // Disable automatic retries
};
```

---

## 🐛 Debugging

### Check Retry Behavior

In browser console (development mode):

```
[API Request] POST /applications/submit
[API Error] 503 /applications/submit { requestId: 'abc-123', retryCount: 0 }
[API Retry] Attempt 1/3 for /applications/submit { delayMs: 10000, errorCode: 'SERVICE_UNAVAILABLE' }
[API Error] 503 /applications/submit { requestId: 'abc-123', retryCount: 1 }
[API Retry] Attempt 2/3 for /applications/submit { delayMs: 20000, errorCode: 'SERVICE_UNAVAILABLE' }
[API Response] 200 /applications/submit { retryCount: 2, duration: 32145 }
```

### Inspect Request Metadata

```typescript
apiClient.interceptors.response.use(
  (response) => {
    console.log('Retry count:', response.config.metadata?.retryCount);
    console.log('Total time:', 
      response.config.metadata?.endTime - 
      response.config.metadata?.startTime
    );
    return response;
  }
);
```

---

## 📚 Related Files

- `src/lib/api/axios-config.ts` - Main axios client with interceptors
- `src/lib/api/form-submission.ts` - Form submission service using apiClient
- `src/constants/form.ts` - API configuration constants
- `src/constants/messages.ts` - Error messages and titles

---

## ✅ Summary

### What Changed
- ✨ Added automatic retry logic to axios response interceptor
- 📊 Enhanced metadata tracking (retry count, timing)
- 🔍 Improved development logging
- 🎯 Smart error classification and retry decisions
- 📈 Exponential backoff with rate limit awareness

### What Stayed the Same
- ✅ All existing error handling
- ✅ Backward compatible with `retryRequest()`
- ✅ Same error types and messages
- ✅ No breaking changes to existing code

### Benefits
- 🚀 Better user experience (transparent retry)
- 🛡️ Improved reliability for transient failures
- 🔧 Configurable and testable
- 📊 Better observability with tracking

---

**Implementation Date**: October 7, 2025  
**Status**: ✅ Complete and Production Ready  
**Breaking Changes**: None

