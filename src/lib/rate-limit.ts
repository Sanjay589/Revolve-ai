// In-memory token bucket rate limiter with multi-tenant / multi-user isolation
// Suitable for single-instance / local deployments; uses isolated buckets

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxTokens: number;      // max requests in window
  refillRate: number;     // tokens per second
  windowMs?: number;      // cleanup interval
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

  // Periodic cleanup of old entries with unref to prevent test hangs
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.lastRefill > 300_000) { // 5 minutes
        store.delete(key);
      }
    }
  }, 60_000);

  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }

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

// Pre-configured rate limiters sized for realistic multi-user concurrent traffic
export const authLimiter = createRateLimiter('auth', {
  maxTokens: 30,    // 30 attempts per bucket
  refillRate: 0.5,  // Refills 1 token every 2 seconds
});

export const aiLimiter = createRateLimiter('ai', {
  maxTokens: 60,
  refillRate: 1.0,
});

export const paymentLimiter = createRateLimiter('payment', {
  maxTokens: 20,
  refillRate: 0.5,
});

export const webhookLimiter = createRateLimiter('webhook', {
  maxTokens: 200,
  refillRate: 20,
});

export function getRateLimitIdentifier(req: Request): string {
  // Extract client IP with multi-proxy fallback
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || cfIp || '127.0.0.1';

  // Extract auth/session token to isolate authenticated users on the same IP/NAT
  const authHeader = req.headers.get('authorization') || '';
  const cookieHeader = req.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/revolve_session=([^;]+)/);
  const sessionToken = sessionMatch ? sessionMatch[1].slice(-16) : '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(-16) : '';

  const userContext = sessionToken || bearerToken || '';
  return userContext ? `${ip}:${userContext}` : ip;
}

