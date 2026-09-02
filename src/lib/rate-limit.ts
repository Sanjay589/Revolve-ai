// In-memory token bucket rate limiter
// Suitable for single-instance deployments; use Redis for multi-instance

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxTokens: number;      // max requests in window
  refillRate: number;      // tokens per second
  windowMs?: number;       // cleanup interval
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

export function createRateLimiter(name: string, config: RateLimitConfig) {
  const { maxTokens, refillRate } = config;
  const store = getStore(name);

  // Periodic cleanup of old entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.lastRefill > 300_000) { // 5 minutes
        store.delete(key);
      }
    }
  }, 60_000); // every minute

  return {
    check(identifier: string): { allowed: boolean; remaining: number; retryAfter?: number } {
      const now = Date.now();
      let entry = store.get(identifier);

      if (!entry) {
        entry = { tokens: maxTokens, lastRefill: now };
        store.set(identifier, entry);
      }

      // Refill tokens based on elapsed time
      const elapsed = (now - entry.lastRefill) / 1000;
      entry.tokens = Math.min(maxTokens, entry.tokens + elapsed * refillRate);
      entry.lastRefill = now;

      if (entry.tokens >= 1) {
        entry.tokens -= 1;
        return { allowed: true, remaining: Math.floor(entry.tokens) };
      }

      const retryAfter = Math.ceil((1 - entry.tokens) / refillRate);
      return { allowed: false, remaining: 0, retryAfter };
    },
  };
}

// Pre-configured rate limiters
export const authLimiter = createRateLimiter('auth', {
  maxTokens: 10,    // 10 attempts
  refillRate: 0.1,  // 1 token per 10 seconds
});

export const aiLimiter = createRateLimiter('ai', {
  maxTokens: 20,
  refillRate: 0.5,
});

export const paymentLimiter = createRateLimiter('payment', {
  maxTokens: 5,
  refillRate: 0.2,
});

export const webhookLimiter = createRateLimiter('webhook', {
  maxTokens: 100,
  refillRate: 10,
});

export function getRateLimitIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}
