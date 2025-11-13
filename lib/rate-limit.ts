// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Client Redis Upstash (si configuré)
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Rate limiter général : 10 requêtes / minute par IP
 */
export const rateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "mrk:general",
    })
  : null;

/**
 * Rate limiter pour la génération d'histoires : 3 / heure par IP
 */
export const storyRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "mrk:story",
    })
  : null;

/**
 * ⛑️ Fallback en mémoire pour le dev (si pas de Redis)
 * ⚠️ Ne pas compter dessus en production
 */
const inMemoryCache = new Map<
  string,
  { count: number; resetAt: number }
>();

export async function checkRateLimitFallback(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const key = `fallback:${identifier}`;
  const record = inMemoryCache.get(key);

  if (!record || now > record.resetAt) {
    inMemoryCache.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
