import { stripe } from "../../../lib/stripe";
import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`📥 Webhook: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const email = session.customer_details?.email || session.metadata?.email;

        if (!email) break;

        let subscriptionType = "monthly";
        let storiesTotal = 20;

        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const interval = subscription.items.data[0]?.price?.recurring?.interval;
          if (interval === "year") {
            subscriptionType = "yearly";
            storiesTotal = 300;
          }
        }

        await supabase.from("users").upsert(
          {
            email: email,
            is_active: true,
            subscription_start: new Date().toISOString(),
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_type: subscriptionType,
            stories_remaining: storiesTotal,
            stories_total: storiesTotal,
            stories_used: 0,
          },
          { onConflict: "email" }
        );

        console.log(`✅ Utilisateur activé: ${email}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await supabase
          .from("users")
          .update({
            is_active: false,
            subscription_end: new Date().toISOString(),
          })
          .eq("stripe_customer_id", subscription.customer);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Erreur webhook:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}