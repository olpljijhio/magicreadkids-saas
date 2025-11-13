import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";

export const metadata = {
  title: "MagicReadKids - Créez des histoires magiques pour vos enfants",
  description:
    "Générez des histoires personnalisées pour vos enfants en 30 secondes avec l’IA.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MagicReadKids",
  url: "https://app.magicreadkids.fr",
  logo: "https://app.magicreadkids.fr/logo.png",
  description:
    "Créez des histoires magiques et personnalisées pour vos enfants.",
  founder: {
    "@type": "Person",
    name: "Elina Martin",
  },
  sameAs: [
    "https://magicreadkids.fr",
    "https://twitter.com/magicreadkids",
    "https://instagram.com/magicreadkids",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
