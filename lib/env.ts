import "server-only";

type EnvKeys =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "OPENAI_API_KEY"
  | "STRIPE_SECRET_KEY"
  | "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "NEXT_PUBLIC_STRIPE_PRICE_MONTHLY"
  | "NEXT_PUBLIC_STRIPE_PRICE_YEARLY"
  | "NEXT_PUBLIC_APP_URL"
  | "NEXT_PUBLIC_BLOG_URL";

type Env = {
  [K in EnvKeys]?: string;
};

const envCache: Env = {};

export function getEnv(key: EnvKeys): string {
  if (envCache[key] !== undefined) return envCache[key] as string;

  const value = process.env[key];

  if (!value) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ENV] Variable manquante : ${key}`);
    }
    // On retourne une chaîne vide pour ne pas faire planter l'app
    envCache[key] = "";
    return "";
  }

  envCache[key] = value;
  return value;
}
