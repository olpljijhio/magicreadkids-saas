import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl, getRequiredEnv } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const stripe = getStripe();
		const body = await req.json();
		const plan = (body?.plan as "monthly" | "yearly") || "monthly";

		// TODO: Replace cookie-based email with Supabase auth session (user id/email)
		const userEmail = req.cookies.get("user_email")?.value || body?.email;
		if (!userEmail) {
			return NextResponse.json({ error: "Missing user email" }, { status: 400 });
		}

		const priceId =
			plan === "yearly" ? getRequiredEnv("NEXT_PUBLIC_STRIPE_PRICE_YEARLY") : getRequiredEnv("NEXT_PUBLIC_STRIPE_PRICE_MONTHLY");

		// Find or create customer
		const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
		const customer = customers.data[0] || (await stripe.customers.create({ email: userEmail }));

		const baseUrl = getBaseUrl();
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			payment_method_types: ["card"],
			customer: customer.id,
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${baseUrl}/cancel`,
			metadata: {
				user_email: userEmail,
			},
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Checkout error:", error);
		return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
	}
}


