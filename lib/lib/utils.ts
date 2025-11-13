import type { IncomingHttpHeaders } from "http";

/**
 * Récupère une variable d'environnement obligatoire.
 * Lance une erreur explicite si elle est manquante.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.length === 0) {
    throw new Error(`Variable d'environnement manquante : ${key}`);
  }
  return value;
}

/**
 * Base URL de l'application (prod ou dev).
 */
export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit && explicit.length > 0) {
    return explicit;
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel && vercel.length > 0) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}

/**
 * Infère le type d'abonnement à partir d'un priceId Stripe.
 */
export function inferSubscriptionType(priceId: string): "monthly" | "yearly" {
  const yearlyId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;
  if (yearlyId && priceId === yearlyId) {
    return "yearly";
  }
  return "monthly";
}

/**
 * Récupère une adresse IP raisonnable depuis des headers.
 * (utile côté API si besoin)
 */
export function getIpFromHeaders(headers: IncomingHttpHeaders): string {
  const xff = headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0]!.trim();
  }
  const realIp = headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp;
  }
  return "unknown";
}
