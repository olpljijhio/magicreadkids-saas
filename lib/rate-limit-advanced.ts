import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { getOptionalEnv } from "@/lib/env";

/**
 * MagicReadKids – Advanced Rate Limiter
 * - Prod: Upstash Redis (sliding window)
 * - Dev: In-memory fallback (non persistant)
 * - Buckets préconfigurés + utilitaires
 */

type BucketName = "general" | "story" | "login" | "signup" | "webhook" | "checkout";

const UPSTASH_URL = getOptionalEnv("UPSTASH_REDIS_REST_URL");
const UPSTASH_TOKEN = getOptionalEnv("UPSTASH_REDIS_REST_TOKEN");

const redis = UPSTASH_URL && UPSTASH_TOKEN
  ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
  : null;

/** Config par bucket (requests, window) */
const BUCKETS: Record<BucketName, { limit: number; window: `${number} ${"s"|"m"|"h"}`; prefix: string; analytics?: boolean }> = {
  general: { limit: 10, window: "1 m", prefix: "mrk:gen", analytics: true },
  story:   { limit: 3,  window: "1 h", prefix: "mrk:story", analytics: true },
  login:   { limit: 5,  window: "15 m", prefix: "mrk:login", analytics: true },
  signup:  { limit: 5,  window: "15 m", prefix: "mrk:signup", analytics: true },
  webhook: { limit: 30, window: "1 m", prefix: "mrk:webhook" },
  checkout:{ limit: 15, window: "10 m", prefix: "mrk:checkout" },
};

/** Upstash Ratelimit instances par bucket (si Redis dispo) */
const upstashLimits: Partial<Record<BucketName, Ratelimit>> = {};
if (redis) {
  (Object.keys(BUCKETS) as BucketName[]).forEach((b) => {
    const cfg = BUCKETS[b];
    upstashLimits[b] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(cfg.limit, cfg.window),
      analytics: cfg.analytics ?? false,
      prefix: cfg.prefix,
    });
  });
}

/** Fallback mémoire pour dev */
type MemoryRecord = { count: number; resetAt: number };
const memoryStore = new Map<string, MemoryRecord>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const rec = memoryStore.get(key);
  if (!rec || now >= rec.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (rec.count >= limit) {
    return { success: false, remaining: 0, resetAt: rec.resetAt };
  }
  rec.count += 1;
  return { success: true, remaining: limit - rec.count, resetAt: rec.resetAt };
}

/** Convertit "1 m" / "15 m" / "1 h" -> ms */
function windowToMs(window: `${number} ${"s"|"m"|"h"}`): number {
  const [nStr, unit] = window.split(" ") as [string, "s"|"m"|"h"];
  const n = Number(nStr);
  if (unit === "s") return n * 1000;
  if (unit === "m") return n * 60_000;
  return n * 3_600_000; // "h"
}

/** Construit une clé stable pour le rate-limit */
function buildKey(bucket: BucketName, identifier: string) {
  const p = BUCKETS[bucket].prefix;
  return `${p}:${identifier}`;
}

/** Récupère une "IP" fiable depuis NextRequest */
export function getClientIp(req: NextRequest): string {
  return (
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * checkRateLimit
 * @param identifier string (ip, userId, sessionId, etc.)
 * @param bucket BucketName
 */
export async function checkRateLimit(
  identifier: string,
  bucket: BucketName = "general"
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const cfg = BUCKETS[bucket];

  // Upstash (prod)
  if (redis && upstashLimits[bucket]) {
    const res = await upstashLimits[bucket]!.limit(buildKey(bucket, identifier));
    // Upstash renvoie reset dans "reset" (date epoch en sec)
    const resetAt = (res.reset ?? Math.floor(Date.now() / 1000) + windowToMs(cfg.window) / 1000) * 1000;
    return {
      success: res.success,
      remaining: res.remaining,
      resetAt,
    };
  }

  // Fallback mémoire (dev)
  const key = buildKey(bucket, identifier);
  const windowMs = windowToMs(cfg.window);
  return memoryLimit(key, cfg.limit, windowMs);
}

/**
 * Middleware helper (App Router handlers)
 * Permet d'appliquer un rate-limit en 1 ligne à tes routes.
 */
export async function withRateLimit(
  req: NextRequest,
  bucket: BucketName,
  onLimited?: (info: { remaining: number; resetAt: number }) => Response
): Promise<{ ok: true } | Response> {
  const ip = getClientIp(req);
  const { success, remaining, resetAt } = await checkRateLimit(ip, bucket);
  if (!success) {
    if (onLimited) return onLimited({ remaining, resetAt });
    return new Response(
      JSON.stringify({
        error: "Trop de requêtes. Réessayez plus tard.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAt: resetAt,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.max(0, Math.ceil((resetAt - Date.now()) / 1000)).toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  }
  return { ok: true };
}

/**
 * Exemple d'utilisation dans une route:
 *
 * export async function POST(req: NextRequest) {
 *   const limited = await withRateLimit(req, "story");
 *   if (limited instanceof Response) return limited;
 *   // ... ton code
 * }
 */
