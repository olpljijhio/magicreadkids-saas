export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c471ed33] via-[#f64f5933] to-transparent" />
      <div className="relative mx-auto max-w-5xl px-4 md:px-6 py-14 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Redonnons aux enfants le goût des histoires 💞
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          Je suis <strong>Élina</strong>, maman passionnée de lecture jeunesse.
          J&apos;aide les parents à réintroduire la douceur et la magie des livres dans les rituels du soir 🌙
          Ici, chaque histoire est une émotion, un lien, un souvenir partagé.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={process.env.NEXT_PUBLIC_BLOG_URL as string} target="_blank" rel="noopener noreferrer" className="rounded-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800">
            Voir les sélections du blog
          </a>
          <a href="/generate" className="rounded-full px-6 py-3 text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59]">
            Créer une histoire
          </a>
        </div>
      </div>
    </section>
  );
}