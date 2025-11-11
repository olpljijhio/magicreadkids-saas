import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const stripe = getStripe();
		// TODO: Replace cookie-based email with Supabase auth session
		const userEmail = req.cookies.get("user_email")?.value || (await req.json())?.email;
		if (!userEmail) {
			return NextResponse.json({ error: "Missing user email" }, { status: 400 });
		}
		const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
		const customer = customers.data[0];
		if (!customer) {
			return NextResponse.json({ error: "Customer not found" }, { status: 404 });
		}
		const session = await stripe.billingPortal.sessions.create({
			customer: customer.id,
			return_url: `${getBaseUrl()}/`,
		});
		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Stripe portal error:", error);
		return NextResponse.json({ error: "Unable to create portal session" }, { status: 500 });
	}
}


