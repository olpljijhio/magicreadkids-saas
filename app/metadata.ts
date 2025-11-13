import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicReadKids – Créez des histoires magiques pour vos enfants en 30 secondes",
  description: "Générez des histoires personnalisées 100% uniques pour vos enfants grâce à l'IA. Prénom, âge, passions... Une aventure sur mesure en quelques clics. Sans engagement.",
  keywords: [
    "histoires personnalisées enfants",
    "histoires sur mesure",
    "intelligence artificielle enfants",
    "rituel du soir",
    "histoires pour enfants",
    "conte personnalisé",
    "lecture enfant",
    "histoire du soir",
    "MagicReadKids",
    "Élina Martin"
  ],
  authors: [{ name: "Élina Martin" }],
  creator: "MagicReadKids",
  publisher: "MagicReadKids",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://app.magicreadkids.fr",
    title: "MagicReadKids – Histoires magiques personnalisées pour enfants",
    description: "Créez des histoires 100% personnalisées pour vos enfants en 30 secondes avec l'IA",
    siteName: "MagicReadKids",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicReadKids – Histoires personnalisées",
    description: "Des histoires magiques créées par IA pour vos enfants",
    creator: "@magicreadkids",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
