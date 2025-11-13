export const metadata = { title: "Confidentialité (RGPD) – MagicReadKids" };

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 md:px-6 py-12 prose prose-pink">
      <h1>Politique de confidentialité (RGPD)</h1>
      <h2>Données traitées</h2>
      <p>Compte (email), prénoms/âges des enfants, préférences d’histoires, métadonnées techniques (logs), facturation (Stripe).</p>
      <h2>Finalités</h2>
      <p>Création d’histoires personnalisées, gestion d’abonnement, amélioration du service, support.</p>
      <h2>Base légale</h2>
      <p>Exécution du contrat (abonnement), intérêt légitime (amélioration), consentement (cookies analytiques).</p>
      <h2>Durées de conservation</h2>
      <p>Compte : pendant la relation + 3 ans inactif. Facturation : 10 ans. Journaux techniques : 12 mois.</p>
      <h2>Destinataires / Sous-traitants</h2>
      <ul>
        <li>Hébergement & déploiement : Vercel</li>
        <li>Paiement : Stripe</li>
        <li>Bases de données : Supabase</li>
        <li>Génération de texte : OpenAI (contenus enfants pseudonymisés)</li>
      </ul>
      <h2>Transferts hors UE</h2>
      <p>Certains prestataires peuvent être situés hors UE. Des garanties appropriées sont mises en place (SCC, DPA).</p>
      <h2>Droits RGPD</h2>
      <p>Accès, rectification, effacement, limitation, opposition, portabilité. Contact : [email DPO].</p>
      <h2>Mineurs</h2>
      <p>Le service s’adresse aux parents. Le parent renseigne les prénoms/âges de l’enfant et consent au traitement.</p>
      <h2>Cookies</h2>
      <p>Voir <a href="/cookies">notre Politique Cookies</a>. Les cookies analytiques ne sont déposés qu’après consentement.</p>
      <p className="text-xs text-gray-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
    </section>
  );
}