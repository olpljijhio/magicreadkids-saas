export const metadata = { title: "Politique Cookies – MagicReadKids" };

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 md:px-6 py-12 prose prose-pink">
      <h1>Politique Cookies</h1>
      <p>Nous utilisons des cookies essentiels (auth, session, sécurité) et, avec votre consentement, des cookies analytiques.</p>
      <h2>Gestion du consentement</h2>
      <p>Lors de votre première visite, une bannière vous permet d’accepter ou refuser les cookies non essentiels.</p>
      <h2>Mesure d’audience</h2>
      <p>Si vous acceptez, nous pouvons utiliser un outil d’analyse (ex : Plausible, GA4). Cookies déposés après consentement.</p>
      <h2>Paramètres</h2>
      <p>Vous pouvez modifier votre choix en effaçant le stockage du navigateur (clé <code>mk_cookies_v1</code>) ou via votre navigateur.</p>
    </section>
  );
}