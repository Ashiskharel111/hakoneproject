/**
 * In-Memory Token-Bucket Rate Limiter
 * 
 * Provides per-key rate limiting with configurable request count and time window.
 * Uses an in-memory store with automatic cleanup of expired entries.
 * 
 * Note: In-memory limiters reset on server restart and don't share state across
 * serverless instances. For production at scale, consider Redis-backed solutions.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRefill > windowMs * 2) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Check if a request is within rate limits.
 * 
 * @param key - Unique identifier (e.g., `payment:192.168.1.1`)
 * @param maxRequests - Maximum requests allowed within the window
 * @param windowMs - Time window in milliseconds
 * @returns RateLimitResult with allowed status and retry info
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  cleanupStaleEntries(windowMs);

  let entry = store.get(key);

  if (!entry) {
    // First request — initialize bucket
    entry = { tokens: maxRequests - 1, lastRefill: now };
    store.set(key, entry);
    return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refillRate = maxRequests / windowMs; // tokens per ms
  const tokensToAdd = elapsed * refillRate;
  entry.tokens = Math.min(maxRequests, entry.tokens + tokensToAdd);
  entry.lastRefill = now;

  if (entry.tokens >= 1) {
    entry.tokens -= 1;
    store.set(key, entry);
    return { allowed: true, remaining: Math.floor(entry.tokens), retryAfterMs: 0 };
  }

  // Rate limited — calculate when the next token will be available
  const msUntilNextToken = (1 - entry.tokens) / refillRate;
  store.set(key, entry);
  return { allowed: false, remaining: 0, retryAfterMs: Math.ceil(msUntilNextToken) };
}
