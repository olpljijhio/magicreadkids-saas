export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
      role="region"
    >
      {/* soft gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6 py-14 md:py-20 text-center">
        <div aria-hidden="true" className="text-5xl md:text-6xl mb-5 md:mb-6">✨</div>

        <h1
          id="hero-title"
          className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
        >
          Créez des histoires magiques
          <br className="hidden sm:block" />
          pour vos enfants en quelques clics 💜
        </h1>

        <p className="mt-5 md:mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Je suis <strong>Élina</strong>, maman de Léo et Zoé. Grâce à
          l&apos;intelligence artificielle, je vous aide à créer des histoires{" "}
          <strong>100% personnalisées</strong> qui font briller les yeux de vos
          enfants 🌙
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/generate"
            className="inline-flex items-center justify-center rounded-full px-6 md:px-8 py-3.5 md:py-4 text-white font-semibold md:font-bold text-base md:text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 active:opacity-90 transition shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            ✨ Créer ma première histoire
          </a>

          <a
            href="/abonnement"
            className="inline-flex items-center justify-center rounded-full px-6 md:px-8 py-3.5 md:py-4 font-semibold md:font-bold text-base md:text-lg bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition shadow-lg border-2 border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Découvrir les formules
          </a>
        </div>
      </div>
    </section>
  );
}
