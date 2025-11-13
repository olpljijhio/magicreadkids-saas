import Hero from "./components/Hero";

export default function HomePage() {
  return (
    <div>
      {/* Section Héro */}
      <Hero />

      {/* SECTION 1 : Comment ça marche */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1️⃣",
                title: "Personnalisez",
                text: "Prénom, âge, passions de votre enfant",
              },
              {
                step: "2️⃣",
                title: "L'IA crée",
                text: "Une histoire unique en 30 secondes",
              },
              {
                step: "3️⃣",
                title: "Racontez",
                text: "Créez des moments magiques",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 : Pourquoi MagicReadKids */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Pourquoi MagicReadKids ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "100% Personnalisé",
                text: "Chaque histoire est unique et adaptée à votre enfant",
              },
              {
                icon: "⚡",
                title: "En 30 secondes",
                text: "Une génération instantanée et magique",
              },
              {
                icon: "💜",
                title: "Valeurs positives",
                text: "Des histoires pleines de courage, d’amitié et d’amour",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 : Appel à l’action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Prêt à faire rêver vos enfants ?
          </h2>

          <a
            href="/generate"
            className="inline-block rounded-full px-10 py-4 font-bold text-lg bg-white text-purple-700 hover:bg-gray-100 transition-all shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600"
          >
            🚀 Créer ma première histoire gratuite
          </a>
        </div>
      </section>
    </div>
  );
}
