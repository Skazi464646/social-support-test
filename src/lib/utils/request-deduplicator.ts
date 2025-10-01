/**
 * Request Deduplication Utility
 * Module 5 - Step 2: Enhanced Security Features
 */

import { createHash } from 'crypto';

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  abortController: AbortController;
}

/**
 * Creates a hash for request deduplication
 */
function createRequestHash(fieldId: string, inputValue: string, options: any = {}): string {
  const normalizedInput = inputValue.trim().toLowerCase();
  const optionsString = JSON.stringify(options, Object.keys(options).sort());
  const combined = `${fieldId}:${normalizedInput}:${optionsString}`;
  
  // Use a simple hash for browser compatibility
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Request deduplicator to prevent duplicate API calls
 */
export class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly maxAge = 30000; // 30 seconds

  /**
   * Get existing request or create new one
   */
  async deduplicate<T>(
    fieldId: string,
    inputValue: string,
    options: any,
    requestFn: (abortSignal: AbortSignal) => Promise<T>
  ): Promise<T> {
    const hash = createRequestHash(fieldId, inputValue, options);
    
    // Clean up expired requests
    this.cleanupExpired();
    
    // Check if we already have this request pending
    const existing = this.pendingRequests.get(hash);
    if (existing) {
      console.log(`[RequestDeduplicator] Reusing existing request for hash: ${hash}`);
      return existing.promise as Promise<T>;
    }
    
    // Create new request
    const abortController = new AbortController();
    const promise = requestFn(abortController.signal);
    
    const pendingRequest: PendingRequest = {
      promise,
      timestamp: Date.now(),
      abortController,
    };
    
    this.pendingRequests.set(hash, pendingRequest);
    
    // Clean up when request completes (success or failure)
    promise.finally(() => {
      this.pendingRequests.delete(hash);
    });
    
    console.log(`[RequestDeduplicator] Created new request for hash: ${hash}`);
    return promise;
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    for (const [hash, request] of this.pendingRequests) {
      request.abortController.abort();
    }
    this.pendingRequests.clear();
  }

  /**
   * Cancel specific request by hash
   */
  cancel(fieldId: string, inputValue: string, options: any = {}): void {
    const hash = createRequestHash(fieldId, inputValue, options);
    const request = this.pendingRequests.get(hash);
    
    if (request) {
      request.abortController.abort();
      this.pendingRequests.delete(hash);
    }
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    this.cleanupExpired();
    return this.pendingRequests.size;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    
    for (const [hash, request] of this.pendingRequests) {
      if (now - request.timestamp > this.maxAge) {
        request.abortController.abort();
        this.pendingRequests.delete(hash);
      }
    }
  }
}

// Global deduplicator instance
export const requestDeduplicator = new RequestDeduplicator();