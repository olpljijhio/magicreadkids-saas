import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/utils";

let stripeInstance: Stripe | null = null;

/**
 * Singleton Stripe, configuré avec l'API version stable.
 */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    });
  }
  return stripeInstance;
}
