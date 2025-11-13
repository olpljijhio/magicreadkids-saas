// ============================================
// ⚡ MagicReadKids - Rate Limiting Middleware
// Auteur : Élina
// Objectif : Sécuriser l’API avec un throttling intelligent
// Compatible : Next.js App Router / Upstash Redis / DEV local
// ============================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* -----------------------------------------------------------
 * ⚙️ INITIALISATION SECURISEE DE REDIS
 * ----------------------------------------------------------- */

let redis: Redis | null = null;

/**
 * On ne crée une instance Redis que si les variables sont présentes.
 * Sinon, on retombe sur le cache mémoire local (mode DEV).
 */
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.info("✅ Upstash Redis initialisé avec succès.");
  } catch (err) {
    console.error("❌ Erreur d'initialisation Redis :", err);
    redis = null;
  }
} else {
  console.warn("⚠️ Upstash non configuré — utilisation du fallback mémoire (DEV).");
}

/* -----------------------------------------------------------
 * 🔒 RATE LIMITERS
 * ----------------------------------------------------------- */

/**
 * Limiteur global : protège l’API entière
 * Exemple : 10 requêtes / minute par IP
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
 * Limiteur spécial pour la génération d’histoires IA :
 * 3 par heure et par utilisateur.
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
 * Limiteur d’authentification :
 * 5 tentatives de connexion par 15 minutes.
 */
export const loginRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "mrk:login",
    })
  : null;

/* -----------------------------------------------------------
 * 🧠 FALLBACK MÉMOIRE (DEV UNIQUEMENT)
 * ----------------------------------------------------------- */

interface FallbackRecord {
  count: number;
  resetAt: number;
}

const inMemoryCache = new Map<string, FallbackRecord>();

/**
 * Fallback local en mémoire — utile pour le mode développement
 * ❌ Non persistant / Non sécurisé
 */
export async function checkRateLimitFallback(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const key = `fallback:${identifier}`;
  const record = inMemoryCache.get(key);

  if (!record || now > record.resetAt) {
    inMemoryCache.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  inMemoryCache.set(key, record);
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/* -----------------------------------------------------------
 * 🧩 UTILITAIRE GLOBAL
 * ----------------------------------------------------------- */

/**
 * Vérifie si un identifiant (IP, userId…) respecte le rate limit global.
 * Utilise Upstash si disponible, sinon le fallback local.
 */
export async function checkRateLimit(
  identifier: string,
  limitType: "general" | "story" | "login" = "general"
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  try {
    // Utiliser Upstash si dispo
    if (redis) {
      const limiter =
        limitType === "story"
          ? storyRateLimiter
          : limitType === "login"
          ? loginRateLimiter
          : rateLimiter;

      if (!limiter) throw new Error("Aucun rate limiter configuré.");

      const { success, remaining, reset } = await limiter.limit(identifier);
      return { success, remaining, resetAt: reset };
    }

    // Sinon fallback local
    return await checkRateLimitFallback(identifier);
  } catch (err) {
    console.error("⚠️ Erreur rate limiter :", err);
    // Ne bloque pas la requête si une erreur survient
    return { success: true, remaining: 999, resetAt: Date.now() + 60_000 };
  }
}
