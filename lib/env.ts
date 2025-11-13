// lib/env.ts
import "server-only";
import { z } from "zod";

/**
 * ⚠️ Ce module doit être importé uniquement côté serveur.
 * Ne pas l'utiliser dans des composants "use client".
 */

const isProd = process.env.NODE_ENV === "production";

const OpenAIKeySchema = z
  .string()
  .min(10, "Clé OpenAI manquante")
  .regex(/^sk-/, "La clé OpenAI doit commencer par 'sk-' (ex: sk-... ou sk-proj-...)");

const StripeSecretSchema = z
  .string()
  .min(10, "STRIPE_SECRET_KEY manquante (sk_test_... ou sk_live_...)")
  .regex(/^sk_(test|live)_/, "STRIPE_SECRET_KEY doit commencer par sk_test_ ou sk_live_");

const StripePublishableSchema = z
  .string()
  .min(10, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquante (pk_test_... ou pk_live_...)")
  .regex(/^pk_(test|live)_/, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY doit commencer par pk_test_ ou pk_live_");

const schemaBase = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  // OpenAI
  OPENAI_API_KEY: OpenAIKeySchema,

  // Stripe
  STRIPE_SECRET_KEY: StripeSecretSchema,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: StripePublishableSchema,
  STRIPE_WEBHOOK_SECRET: z.string().min(10).optional(),
  NEXT_PUBLIC_STRIPE_PRICE_MONTHLY: z.string().min(5).optional(),
  NEXT_PUBLIC_STRIPE_PRICE_YEARLY: z.string().min(5).optional(),

  // Sécurité
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(24),

  // Upstash (optionnel)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Sentry (optionnel)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // URLs
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BLOG_URL: z.string().url(),

  // Environnement
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const schema = schemaBase.superRefine((env, ctx) => {
  // Exigences supplémentaires en production
  if (isProd) {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "STRIPE_WEBHOOK_SECRET requis en production",
        path: ["STRIPE_WEBHOOK_SECRET"],
      });
    }
    if (!env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXT_PUBLIC_STRIPE_PRICE_MONTHLY requis en production",
        path: ["NEXT_PUBLIC_STRIPE_PRICE_MONTHLY"],
      });
    }
    if (!env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXT_PUBLIC_STRIPE_PRICE_YEARLY requis en production",
        path: ["NEXT_PUBLIC_STRIPE_PRICE_YEARLY"],
      });
    }
  }

  // Cohérence Upstash
  if (env.UPSTASH_REDIS_REST_URL && !env.UPSTASH_REDIS_REST_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "UPSTASH_REDIS_REST_TOKEN manquant quand l’URL est fournie",
      path: ["UPSTASH_REDIS_REST_TOKEN"],
    });
  }
  if (env.UPSTASH_REDIS_REST_TOKEN && !env.UPSTASH_REDIS_REST_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "UPSTASH_REDIS_REST_URL manquante quand le token est fourni",
      path: ["UPSTASH_REDIS_REST_URL"],
    });
  }
});

export type Env = z.infer<typeof schema>;

let cachedEnv: Env | null = null;

/**
 * Valide et met en cache l'environnement (fonction réutilisable)
 */
function loadEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.errors.map(
      (e) => `• ${e.path.join(".")}: ${e.message}`
    );
    const msg =
      `❌ Variables d’environnement invalides :\n` +
      lines.join("\n") +
      `\n➡️ Corrige ton .env.local / Vercel avant de continuer.`;
    throw new Error(msg);
  }

  cachedEnv = parsed.data;

  if (process.env.NODE_ENV !== "production") {
    console.log("✅ ENV validé avec succès (dev)");
  }

  return cachedEnv;
}

/**
 * Fonction publique utilisée par le layout ou ailleurs.
 * (Corrige l'erreur "validateEnv is not a function")
 */
export function validateEnv(): Env {
  return loadEnv();
}

/**
 * Proxy typé pour accéder à env.MA_CLE de façon safe.
 */
export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string) {
    const e = loadEnv();
    return e[prop as keyof Env];
  },
}) as Env;

/**
 * Helpers pratiques
 */
export function getRequiredEnv<K extends keyof Env>(key: K): Env[K] {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(`ENV manquante : ${String(key)}`);
  }
  return value;
}

export function getOptionalEnv<K extends keyof Env>(key: K): Env[K] | undefined {
  const value = env[key];
  return value === "" ? undefined : value;
}

export function isProduction(): boolean {
  return env.NODE_ENV === "production";
}
