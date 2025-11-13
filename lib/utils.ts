/**
 * Utilitaires globaux pour MagicReadKids
 */

export function getRequiredEnv(key: string): string {
  const v = process.env[key];
  if (!v || v.trim() === "") {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
  return v;
}

export function assertEnv(keys: string[]) {
  const missing: string[] = [];
  for (const k of keys) {
    const v = process.env[k];
    if (!v || v.trim() === "") missing.push(k);
  }
  if (missing.length) {
    throw new Error(`❌ Missing env vars: ${missing.join(", ")}`);
  }
}

/** Base URL publique de l’app (Vercel/Prod ou localhost) */
export function getBaseUrl() {
  // Vercel fournit NEXT_PUBLIC_APP_URL si tu l'as défini, sinon on reconstruit
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit && explicit.trim()) return explicit.replace(/\/+$/, "");
  // Si dispo en edge/runtime Vercel
  const vercelUrl = process.env.VERCEL_URL; // ex: myapp.vercel.app
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/+$/, "");
  // Fallback local
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

/** Parse JSON en sécurité (retourne fallback en cas d’échec) */
export function safeParseJSON<T>(val: string, fallback: T): T {
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

/** Déduire le type d’abonnement depuis un priceId Stripe */
export function inferSubscriptionType(priceId?: string | null): "monthly" | "yearly" | null {
  if (!priceId) return null;
  const id = priceId.toLowerCase();
  if (id.includes("month")) return "monthly";
  if (id.includes("year") || id.includes("annual")) return "yearly";
  return null;
}