import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getRequiredEnv, inferSubscriptionType } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	const webhookSecret = getRequiredEnv("STRIPE_WEBHOOK_SECRET");
	const signature = req.headers.get("stripe-signature");
	if (!signature) {
		return NextResponse.json({ error: "Missing signature" }, { status: 400 });
	}

	const body = await req.text();
	let event: Stripe.DiscriminatedEvent;
	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret) as Stripe.DiscriminatedEvent;
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				const customerId = session.customer as string;
				const email = session.customer_details?.email || (session.metadata?.user_email as string | undefined) || null;
				// Upsert user with stripeCustomerId; set status to active if subscription already active
				if (email) {
					await supabaseAdmin
						.from("users")
						.upsert(
							{
								email,
								stripe_customer_id: customerId,
							},
							{ onConflict: "email" }
						)
						.select()
						.single();
				}
				break;
			}
			case "invoice.paid": {
				const invoice = event.data.object as Stripe.Invoice;
				const customerId = invoice.customer as string;
				const priceId = invoice.lines.data[0]?.price?.id || "";
				const plan = inferSubscriptionType(priceId);
				// Mark subscription active and initialize credits via RPC
				const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single();
				if (user?.id) {
					await supabaseAdmin
						.from("users")
						.update({ subscription_status: "active", subscription_plan: plan })
						.eq("id", user.id);
					await supabaseAdmin.rpc("initialize_credits", { p_user_id: user.id });
				}
				break;
			}
			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;
				const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single();
				if (user?.id) {
					await supabaseAdmin
						.from("users")
						.update({ subscription_status: "canceled" })
						.eq("id", user.id);
				}
				break;
			}
			default: {
				// Ignore other events
			}
		}
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook handling failed:", error);
		return NextResponse.json({ error: "Webhook error" }, { status: 500 });
	}
}

// Types for Stripe event narrowing
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Stripe {
	type DiscriminatedEvent =
		| {
				type: "checkout.session.completed";
				data: { object: Stripe.Checkout.Session };
		  }
		| {
				type: "invoice.paid";
				data: { object: Stripe.Invoice };
		  }
		| {
				type: "customer.subscription.deleted";
				data: { object: Stripe.Subscription };
		  }
		| {
				// Fallback
				type: string;
				data: { object: unknown };
		  };
}


