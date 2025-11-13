// ============================================
// 🧩 MagicReadKids - Sanitize & Secure Helpers
// Auteur : Élina
// Objectif : Assurer la sécurité des contenus HTML, texte et URL
// Compatible : Next.js (SSR/CSR), Supabase, OpenAI outputs
// ============================================

import DOMPurify from "isomorphic-dompurify";

/* -----------------------------------------------------------
 * 🧠 FONCTION : Nettoyage HTML sécurisé
 * ----------------------------------------------------------- */
/**
 * Nettoie le HTML pour prévenir les attaques XSS.
 * Utilisé avant l'affichage de contenu généré par OpenAI ou utilisateur.
 *
 * Exemple :
 *   const clean = sanitizeHTML("<script>...</script><p>Hello</p>");
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return "";

  return DOMPurify.sanitize(dirty, {
    // Autoriser uniquement les balises de base (aucune structure complexe)
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "p",
      "br",
      "span",
      "ul",
      "li",
      "ol"
    ],
    ALLOWED_ATTR: ["class"], // autoriser quelques classes Tailwind si besoin
    ALLOW_DATA_ATTR: false, // bloque data-* potentiellement malveillant
    FORBID_TAGS: ["script", "iframe", "object", "embed"],
  });
}

/* -----------------------------------------------------------
 * ✨ FONCTION : Échapper les caractères spéciaux HTML
 * ----------------------------------------------------------- */
/**
 * Convertit les caractères spéciaux en entités HTML.
 * Préviens l’exécution de code dans un contexte texte brut.
 *
 * Exemple :
 *   const safeText = escapeHTML("<b>Texte</b>");
 */
export function escapeHTML(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/* -----------------------------------------------------------
 * 🌐 FONCTION : Nettoyage d'URL
 * ----------------------------------------------------------- */
/**
 * Nettoie et valide une URL pour éviter les injections ou schémas dangereux.
 *
 * Exemple :
 *   const safe = sanitizeURL("javascript:alert(1)"); // => null
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    // 🔒 Autoriser uniquement les protocoles sécurisés
    if (!["http:", "https:"].includes(parsed.protocol)) {
      console.warn(`⚠️ Protocole interdit détecté : ${parsed.protocol}`);
      return null;
    }

    // 🔒 Empêche les liens vers des domaines suspects
    const hostname = parsed.hostname.toLowerCase();
    const forbiddenDomains = ["localhost", "127.0.0.1"];
    if (forbiddenDomains.some((d) => hostname.includes(d))) {
      console.warn(`⚠️ Domaine interdit : ${hostname}`);
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/* -----------------------------------------------------------
 * 🔐 FONCTION : Sanitize texte brut ou HTML en toute sécurité
 * ----------------------------------------------------------- */
/**
 * Combine `sanitizeHTML` et `escapeHTML` selon le contexte.
 * - Si `allowHTML = true`, nettoie avec DOMPurify.
 * - Sinon, échappe tout pour affichage texte brut.
 */
export function safeOutput(content: string, allowHTML = false): string {
  if (!content) return "";
  return allowHTML ? sanitizeHTML(content) : escapeHTML(content);
}
