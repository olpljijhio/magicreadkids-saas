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
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  OPENAI_API_KEY: OpenAIKeySchema,

  STRIPE_SECRET_KEY: StripeSecretSchema,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: StripePublishableSchema,
  STRIPE_WEBHOOK_SECRET: z.string().min(10).optional(),
  NEXT_PUBLIC_STRIPE_PRICE_MONTHLY: z.string().min(5).optional(),
  NEXT_PUBLIC_STRIPE_PRICE_YEARLY: z.string().min(5).optional(),

  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(24),

  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BLOG_URL: z.string().url(),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const schema = schemaBase.superRefine((env, ctx) => {
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

type Env = z.infer<typeof schema>;

let cachedEnv: Env | null = null;

/**
 * Valide et met en cache l'environnement
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
      `\n➡️ Corrige ton .env.local avant de continuer.`;
    throw new Error(msg);
  }

  cachedEnv = parsed.data;
  if (process.env.NODE_ENV !== "production") {
    console.log("✅ ENV validé avec succès (dev)");
  }
  return cachedEnv;
}

/**
 * Proxy typé pour accéder à process.env de manière sécurisée
 */
export const env: Env = new Proxy({} as Env, {
  get(_, prop: string) {
    const e = loadEnv();
    return e[prop as keyof Env];
  },
});

/**
 * Helpers utiles
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
