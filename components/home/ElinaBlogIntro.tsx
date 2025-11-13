const BLOG = process.env.NEXT_PUBLIC_BLOG_URL || "https://www.magicreadkids.fr";

export default function ElinaBlogIntro() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-[#fbc2eb33] via-[#a18cd133] to-[#89f7fe33]" />
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-3xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-black/5 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">
            Bienvenue dans mon univers de maman ✨
          </h2>
          <p className="mt-4 text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Je suis <strong>Élina</strong> — maman, passionnée de lecture jeunesse et fondatrice de MagicReadKids.
            Sur mon blog, je partage mes <em>sélections de livres</em>, des <em>rituels du soir</em> qui apaisent,
            et des <em>tranches de vie</em> de maman. Mon objectif : redonner le goût des histoires,
            une page à la fois 💜
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={BLOG}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59] hover:opacity-95"
            >
              Découvrir mon blog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}