import Stripe from "stripe";
import { getRequiredEnv } from "./utils";

let stripeInstance: Stripe | null = null;

/**
 * Lazily instantiate the Stripe client to avoid reading env at module load.
 */
export function getStripe(): Stripe {
	if (!stripeInstance) {
		stripeInstance = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
			apiVersion: "2024-09-30.acacia",
			typescript: true,
		});
	}
	return stripeInstance;
}


