// Minimal shared utilities for environment and parsing
// Keep this file dependency-free and pure

export function assertEnv(varName: string, value: string | undefined): asserts value is string {
	if (!value || value.length === 0) {
		throw new Error(`Missing required environment variable: ${varName}`);
	}
}

export function getRequiredEnv(varName: string): string {
	const value = process.env[varName];
	assertEnv(varName, value);
	return value;
}

export function safeParseJSON<T = unknown>(input: string): { ok: true; value: T } | { ok: false; error: unknown } {
	try {
		const value = JSON.parse(input) as T;
		return { ok: true, value };
	} catch (error) {
		return { ok: false, error };
	}
}

/**
 * Determine subscription type based on Stripe Price IDs.
 * Returns "monthly" | "yearly" | "unknown"
 */
export function inferSubscriptionType(priceId: string): "monthly" | "yearly" | "unknown" {
	const monthly = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "";
	const yearly = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "";
	if (priceId === monthly) return "monthly";
	if (priceId === yearly) return "yearly";
	return "unknown";
}

export function getBaseUrl(): string {
	// Required on Vercel. In local dev, you can set NEXT_PUBLIC_APP_URL=http://localhost:3000
	return getRequiredEnv("NEXT_PUBLIC_APP_URL").replace(/\/+$/, "");
}


