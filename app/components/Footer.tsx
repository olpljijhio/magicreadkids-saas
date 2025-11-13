export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-white font-bold">MAGIC READ KIDS</span>
            </div>
            <p className="text-sm">
              Des histoires magiques pour vos enfants
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/generate" className="hover:text-white transition-colors">Créer une histoire</a></li>
              <li><a href="/abonnement" className="hover:text-white transition-colors">Abonnement</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://magicreadkids.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/aide" className="hover:text-white transition-colors">Aide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <p className="text-sm">magicreadkids@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          © {currentYear} MagicReadKids. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
