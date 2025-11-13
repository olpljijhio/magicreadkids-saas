"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <span className="text-xl font-bold text-gray-900">MAGIC READ KIDS</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Accueil
            </a>
            <a href="/generate" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Créer une histoire
            </a>
            <a href="/abonnement" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Abonnement
            </a>
            <a href="https://magicreadkids.fr" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Blog
            </a>
            <button onClick={handleLogout} className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-purple-700 transition-all">
              Mon compte
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
