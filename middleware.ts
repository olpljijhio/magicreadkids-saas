// ============================================
// 🛡 MagicReadKids – Global Security Middleware
// ============================================
//
// Ce middleware protège l'application contre les
// attaques courantes : XSS, clickjacking, sniffing,
// framing, et renforce la confidentialité.
//
// Compatible :
// - Next.js App Router (v14+)
// - Supabase / OpenAI / Stripe
// - Hébergement sur Vercel
//
// Auteur : Élina 💜
//
// ============================================

import { NextResponse, type NextRequest } from "next/server";

// Fonction principale du middleware
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  /* -----------------------------------------------------------
   * 🔒 HEADERS DE SÉCURITÉ
   * ----------------------------------------------------------- */
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Désactive l’accès aux fonctionnalités sensibles du navigateur
  response.headers.set(
    "Permissions-Policy",
    [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "sync-xhr=(self)",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", ")
  );

  /* -----------------------------------------------------------
   * 🧩 CONTENT SECURITY POLICY (CSP)
   * ----------------------------------------------------------- */
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https:;
    connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com;
    frame-src https://js.stripe.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  /* -----------------------------------------------------------
   * 🧠 OPTIONAL – LOG DEV POUR DEBUG
   * ----------------------------------------------------------- */
  if (process.env.NODE_ENV === "development") {
    console.info(`[Middleware] Secured response for ${request.nextUrl.pathname}`);
  }

  return response;
}

/* -----------------------------------------------------------
 * ⚙️ CONFIGURATION DU MATCHER
 * ----------------------------------------------------------- */
export const config = {
  matcher: [
    /*
     * Appliquer à toutes les routes sauf :
     * - fichiers statiques (_next/static)
     * - optimisations d'image (_next/image)
     * - favicon
     * - fichiers API publics (webhooks Stripe, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)",
  ],
};
