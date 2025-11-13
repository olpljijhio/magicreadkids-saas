"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Heart, BookOpen } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    theme: "",
    specificInterests: "",
  });
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const themes = [
    { value: "aventure", label: "Aventure magique 🗺️" },
    { value: "emotions", label: "Gestion des émotions 💜" },
    { value: "animaux", label: "Animaux rigolos 🦁" },
    { value: "superheros", label: "Super-héros du quotidien 🦸" },
    { value: "espace", label: "Voyage dans l'espace 🚀" },
    { value: "amitie", label: "Amitié et partage 🤝" },
    { value: "peurs", label: "Surmonter ses peurs 💪" },
    { value: "nature", label: "Nature et écologie 🌱" },
  ];

  // Vérifier l'authentification au chargement
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.story) {
        setStory(data.story);
      }
    } catch (error) {
      alert(
        "Une erreur est survenue 😔 Merci de réessayer ou de contacter magicreadkids@gmail.com"
      );
    } finally {
      setLoading(false);
    }
  }

  // Affichage pendant la vérification d'authentification
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <p className="text-xl text-gray-700">Vérification de votre connexion...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Interface principale
  return (
    <div className="min-h-screen section bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Créez votre{" "}
            <span className="gradient-text">histoire magique</span>
          </h1>
          <p className="text-xl text-gray-700">
            En quelques clics, créez une histoire unique pour votre enfant 💜
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORMULAIRE */}
          <div className="card">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  💜 Prénom de votre enfant
                </label>
                <input
                  type="text"
                  placeholder="Ex: Léo, Zoé, Emma..."
                  className="w-full border-2 border-purple-300 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
                  value={formData.childName}
                  onChange={(e) =>
                    setFormData({ ...formData, childName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  🎂 Âge
                </label>
                <select
                  className="w-full border-2 border-purple-300 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
                  value={formData.childAge}
                  onChange={(e) =>
                    setFormData({ ...formData, childAge: e.target.value })
                  }
                  required
                >
                  <option value="">Choisir l'âge</option>
                  {[...Array(13)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} {i <= 1 ? "an" : "ans"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  🎨 Thème de l'histoire
                </label>
                <select
                  className="w-full border-2 border-purple-300 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData({ ...formData, theme: e.target.value })
                  }
                  required
                >
                  <option value="">Choisir un thème</option>
                  {themes.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  ⭐ Ce qu'il/elle aime (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: les dinosaures, la danse, son doudou lapin..."
                  className="w-full border-2 border-purple-300 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition"
                  value={formData.specificInterests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specificInterests: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="inline w-6 h-6 mr-2 animate-spin" />
                    Création de la magie en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="inline w-6 h-6 mr-2" />
                    Créer l'histoire magique
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="text-gray-700 italic text-sm">
                💜 <strong>Astuce d'Élina :</strong> Plus vous donnez de
                détails, plus l'histoire sera magique ! 😊✨
              </p>
            </div>
          </div>

          {/* RÉSULTAT */}
          <div className="card">
            {!story && !loading && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-30" />
                <p className="text-lg">
                  Remplissez le formulaire et créez votre première histoire
                  magique ✨
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <Loader2 className="w-16 h-16 mx-auto text-purple-600 animate-spin mb-4" />
                <p className="text-xl font-display text-gray-700 mb-2">
                  Création de la magie en cours...
                </p>
                <p className="text-gray-600">
                  Notre IA crée une histoire unique pour {formData.childName} ✨
                </p>
              </div>
            )}

            {story && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold gradient-text mb-2">
                    L'histoire de {formData.childName} ✨
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                      {story}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <p className="text-gray-700">
                    💛 <strong>Cette histoire vous plaît ?</strong> Vous pouvez
                    créer une nouvelle histoire différente !
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}