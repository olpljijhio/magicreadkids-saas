"use client";
import Script from "next/script";

const testimonials = [
  {
    name: "Camille, maman de Zoé (5 ans)",
    text:
      "Les histoires personnalisées sont devenues notre rituel du soir. Zoé adore se reconnaître dans l’aventure, c’est magique !",
  },
  {
    name: "Thomas, papa de Léo (7 ans)",
    text:
      "Simple, rapide, et surtout émouvant. Mon fils me demande une histoire “comme hier” tous les soirs. Bravo MagicReadKids !",
  },
  {
    name: "Mélanie, maman de Lina (3 ans)",
    text:
      "Parfait pour apaiser le coucher. Les thèmes sont doux et adaptés à l’âge. On a retrouvé le plaisir de lire ensemble.",
  },
];

export default function Testimonials() {
  const blog = process.env.NEXT_PUBLIC_BLOG_URL || "https://www.magicreadkids.fr";

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "MagicReadKids – Histoires personnalisées pour enfants",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: testimonials.length.toString(),
      bestRating: "5",
      worstRating: "1"
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewBody: t.text,
      author: { "@type": "Person", name: t.name },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5", worstRating: "1" }
    }))
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#f5f3ff] to-transparent">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">Avis des parents</h2>
        <p className="text-center text-gray-600 mt-3">
          Ils sont <span className="font-semibold">satisfaits</span> des histoires personnalisées ✨
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/90 p-6 md:p-8 ring-1 ring-black/5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-amber-500 text-lg" aria-label="5 étoiles">★★★★★</div>
              <p className="mt-3 text-gray-800 leading-relaxed">{t.text}</p>
              <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/generate" className="rounded-full px-6 py-3 text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59]">
            Créer une histoire maintenant
          </a>
          <a href={blog} target="_blank" rel="noopener noreferrer" className="rounded-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800">
            Voir plus d’avis sur le blog
          </a>
        </div>
      </div>

      {/* JSON-LD pour le SEO */}
      <Script
        id="mrk-reviews-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </section>
  );
}