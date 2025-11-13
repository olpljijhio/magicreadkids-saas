"use client";

import { useState, useTransition, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { GradientButton } from "@/components/ui/GradientButton";
import { PricingCard } from "@/components/pricing/PricingCard";

const MONTHLY_DISPLAY = 7.99;
const YEARLY_DISPLAY = 59.90;

function formatEUR(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export default function AbonnementPage() {
  const [yearly, setYearly] = useState(true);
  const [isPending, startTransition] = useTransition();

  const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!;
  const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!;
  const selectedPriceId = yearly ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID;

  const { yearlySavingAmount, yearlySavingPercent } = useMemo(() => {
    const monthlyTotal = MONTHLY_DISPLAY * 12;            // 7.99 * 12 = 95.88
    const saving = +(monthlyTotal - YEARLY_DISPLAY).toFixed(2); // 35.98 ≈ 36€
    const percent = Math.round((saving / monthlyTotal) * 100);  // ≈ 38%
    return { yearlySavingAmount: saving, yearlySavingPercent: percent };
  }, []);

  async function startCheckout(target: "monthly" | "yearly") {
    const priceId = target === "yearly" ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID;
    if (!priceId) {
      alert("Configuration manquante: NEXT_PUBLIC_STRIPE_PRICE_*");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, plan: target }),
        });
        if (!res.ok) {
          const t = await res.text();
          console.error("Checkout error:", t);
          alert("Erreur Stripe (voir console).");
          return;
        }
        const data = await res.json();
        if (data?.url) window.location.href = data.url;
        else alert("Pas d’URL de redirection retournée par Stripe.");
      } catch (e) {
        console.error(e);
        alert("Erreur réseau.");
      }
    });
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-[#c471ed] to-[#f64f59] text-white">
        <Container className="py-16 md:py-20 text-center flex flex-col items-center gap-5">
          <Badge className="bg-white/85 text-gray-800">
            💡 Économisez {formatEUR(yearlySavingAmount)} (~{yearlySavingPercent}%) avec l’abonnement annuel
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Choisissez votre formule magique pour lire ensemble
          </h1>
          <p className="max-w-2xl text-white/90 text-lg">
            Histoires personnalisées, rituels du soir simplifiés. Douceur & magie pour les familles.
          </p>

          {/* USP bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/90">
            <span>✅ 1 histoire gratuite</span>
            <span>•</span>
            <span>⏳ 3 jours d’essai (désabonnement facile)</span>
            <span>•</span>
            <span>🔒 Satisfait ou remboursé 7 jours</span>
            <span>•</span>
            <span>🕒 Tarif de lancement jusqu’au 31/12</span>
          </div>

          {/* Toggle Mensuel / Annuel */}
          <div className="rounded-full bg-white/15 ring-1 ring-black/10 p-1 flex items-center gap-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                !yearly ? "bg-white text-gray-900 shadow" : "text-white/85"
              }`}
            >
              Mensuel {formatEUR(MONTHLY_DISPLAY)}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                yearly ? "bg-white text-gray-900 shadow" : "text-white/85"
              }`}
            >
              Annuel {formatEUR(YEARLY_DISPLAY)}
            </button>
          </div>

          <GradientButton onClick={() => startCheckout(yearly ? "yearly" : "monthly")} disabled={isPending}>
            {isPending ? "Chargement…" : "Commencer maintenant"}
          </GradientButton>
          <p className="text-sm text-white/80">💌 Aucun spam, désinscription facile</p>
        </Container>
      </section>

      {/* PRICING */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <PricingCard
              title="Mensuel"
              price={formatEUR(MONTHLY_DISPLAY)}
              period="/mois"
              features={[
                "20 histoires / mois",
                "Personnalisation complète",
                "Tous les âges (0-12 ans)",
                "1 histoire gratuite pour essayer",
                "Satisfait ou remboursé 7 jours",
              ]}
              cta="Choisir Mensuel"
              onSelect={() => startCheckout("monthly")}
              note="Sans engagement"
            />
            <PricingCard
              title="Annuel"
              price={formatEUR(YEARLY_DISPLAY)}
              period="/an"
              features={[
                `Économisez ${formatEUR(yearlySavingAmount)} (~${yearlySavingPercent}%)`,
                "300 histoires / an",
                "Priorité nouveautés & thèmes",
                "1 histoire gratuite pour essayer",
                "Satisfait ou remboursé 7 jours",
              ]}
              cta="Choisir Annuel"
              onSelect={() => startCheckout("yearly")}
              highlight
              badge="Économisez 38%"
              note="Meilleur choix"
            />
          </div>
        </Container>
      </section>
    </>
  );
}