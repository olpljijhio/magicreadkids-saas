import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/** Server-only Stripe client (singleton). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.trim()) {
    throw new Error("STRIPE_SECRET_KEY manquant dans .env.local");
  }
  if (!stripeSingleton) {
    // Laisse Stripe utiliser la version par défaut du compte
    stripeSingleton = new Stripe(key);
  }
  return stripeSingleton;
}

/** Lazy export - only called when actually used */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  }
});