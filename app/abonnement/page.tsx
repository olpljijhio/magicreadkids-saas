/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function AbonnementPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState<string | null>(null);
	const monthlyId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
	const yearlyId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;

	async function startCheckout(plan: "monthly" | "yearly") {
		try {
			setLoading(plan);
			// TODO: Replace cookie email with Supabase auth; cookie set client-side just for demo
			document.cookie = `user_email=${encodeURIComponent(email)}; path=/; max-age=86400`;
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan, email }),
			});
			const data = await res.json();
			if (data?.url) {
				window.location.href = data.url as string;
			}
		} finally {
			setLoading(null);
		}
	}

	async function openPortal() {
		setLoading("portal");
		try {
			const res = await fetch("/api/stripe-portal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (data?.url) window.location.href = data.url as string;
		} finally {
			setLoading(null);
		}
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold">Abonnement</h1>
				<p className="text-gray-700 mt-1">Choisissez un plan pour débloquer des crédits d’histoires.</p>
			</div>
			<div className="max-w-md">
				<label className="block text-sm font-medium mb-2">Votre email</label>
				<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
				<p className="text-xs text-gray-500 mt-1">
					Connexion à venir via Supabase Auth. Utilisation d’un cookie temporaire.
				</p>
			</div>
			<div className="grid gap-6 sm:grid-cols-2">
				<PlanCard
					name="Mensuel"
					price="9,90€"
					period="mois"
					features={["Crédits mensuels", "Histoires illimitées sur vos thèmes", "Annulable à tout moment"]}
					onSelect={() => startCheckout("monthly")}
					highlight
				/>
				<PlanCard
					name="Annuel"
					price="99€"
					period="an"
					features={["2 mois offerts", "Crédits mensuels", "Histoires illimitées sur vos thèmes"]}
					onSelect={() => startCheckout("yearly")}
				/>
			</div>
			<div className="text-xs text-gray-500">
				IDs Stripe: mensuel: <code>{monthlyId}</code> – annuel: <code>{yearlyId}</code>
			</div>
			<div>
				<Button variant="outline" onClick={openPortal} isLoading={loading === "portal"}>
					Ouvrir le portail client
				</Button>
			</div>
		</div>
	);
}


