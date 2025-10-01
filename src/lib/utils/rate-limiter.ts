/**
 * Rate Limiter with Token Bucket Algorithm
 * Module 5 - Step 2: Enhanced Security Features
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per second
}

/**
 * Token bucket rate limiter implementation
 */
export class RateLimiter {
  private buckets = new Map<string, TokenBucket>();
  private readonly maxTokens: number;
  private readonly refillRate: number;

  constructor(maxTokens = 10, refillRate = 0.5) { // 10 requests, refill 1 token every 2 seconds
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  /**
   * Check if request is allowed for given key
   */
  isAllowed(key: string): boolean {
    const bucket = this.getBucket(key);
    this.refillBucket(bucket);
    
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    
    return false;
  }

  /**
   * Get time until next token is available (in milliseconds)
   */
  getRetryAfter(key: string): number {
    const bucket = this.getBucket(key);
    this.refillBucket(bucket);
    
    if (bucket.tokens >= 1) {
      return 0;
    }
    
    return Math.ceil(1000 / this.refillRate);
  }

  /**
   * Get current token count for key
   */
  getTokenCount(key: string): number {
    const bucket = this.getBucket(key);
    this.refillBucket(bucket);
    return Math.floor(bucket.tokens);
  }

  /**
   * Reset bucket for key
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  private getBucket(key: string): TokenBucket {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, {
        tokens: this.maxTokens,
        lastRefill: Date.now(),
        maxTokens: this.maxTokens,
        refillRate: this.refillRate,
      });
    }
    
    return this.buckets.get(key)!;
  }

  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = (now - bucket.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * bucket.refillRate;
    
    bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
}

// Global rate limiter instance
export const aiRateLimiter = new RateLimiter();