"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.success) {
        // Rediriger vers la page de génération
        router.push("/generate");
      }
    } catch (error) {
      setError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold mb-2">
            Connexion à <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MagicReadKids</span>
          </h1>
          <p className="text-gray-600">
            Entrez votre email pour commencer à créer des histoires magiques
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                <Mail className="inline w-5 h-5 mr-2" />
                Votre email
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                className="w-full border-2 border-purple-300 rounded-xl p-4 text-lg focus:outline-none focus:border-purple-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}
            <button
  type="submit"
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition"
>
  {loading ? (
    <>
      <Loader2 className="inline w-6 h-6 mr-2 animate-spin" />
      Connexion en cours...
    </>
  ) : (
    <>
      <Sparkles className="inline w-6 h-6 mr-2" />
      Se connecter
    </>
  )}
</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore abonné ?{" "}
              <a href="/abonnement" className="text-purple-600 font-bold hover:underline">
                Découvrir les formules
              </a>
            </p>
          </div>

          <div className="mt-8 bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <p className="text-sm text-gray-700">
              💜 <strong>Pour tester :</strong> Utilisez{" "}
              <code className="bg-purple-100 px-2 py-1 rounded">test@magicreadkids.fr</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}