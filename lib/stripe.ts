import Stripe from "stripe";
import { getRequiredEnv } from "./utils";

// Stripe SDK instance for server-side usage only
export const stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
	apiVersion: "2024-09-30.acacia",
	typescript: true,
});


