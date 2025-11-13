import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { priceId, plan } = await req.json();
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // Essai 3 jours pour tous les plans (tu peux conditionner sur plan === "monthly" si tu préfères)
      subscription_data: { trial_period_days: 3 },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/abonnement`,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error("[checkout] Stripe error:", {
      message: e?.message,
      type: e?.type,
      code: e?.code,
      raw: e?.raw,
    });
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}