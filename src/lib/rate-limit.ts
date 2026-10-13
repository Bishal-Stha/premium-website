import { headers } from 'next/headers';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts client IP address from Next.js request headers.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headerList.get('x-real-ip') || '127.0.0.1';
}

/**
 * Sliding window rate limiter for Server Actions and API routes.
 *
 * @param actionIdentifier Unique string for the action (e.g. "submit_booking")
 * @param limit Maximum number of allowed requests within the time window
 * @param windowSeconds Time window in seconds (default: 60)
 */
export async function checkRateLimit(
  actionIdentifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
  const ip = await getClientIp();
  const key = `${actionIdentifier}:${ip}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInSeconds: windowSeconds };
  }

  if (existing.count >= limit) {
    const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return { allowed: true, remaining: limit - existing.count, resetInSeconds };
}
