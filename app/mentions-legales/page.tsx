export const metadata = { title: "Mentions légales – MagicReadKids" };

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 md:px-6 py-12 prose prose-pink">
      <h1>Mentions légales</h1>
      <p><strong>Éditeur du site :</strong> [Nom de la société], [forme], capital [€], RCS [Ville] n° [SIREN].</p>
      <p><strong>Siège social :</strong> [Adresse complète]</p>
      <p><strong>Contact :</strong> [email de contact]</p>
      <p><strong>Directeur de la publication :</strong> [Nom]</p>
      <p><strong>Hébergeur :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
      <p><strong>Propriété intellectuelle :</strong> Les contenus du site sont protégés. Toute reproduction non autorisée est interdite.</p>
      <p><strong>Crédits :</strong> Design & développement MagicReadKids.</p>
      <p className="text-xs text-gray-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
    </section>
  );
}