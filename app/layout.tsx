import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "MagicReadKids SaaS",
	description: "Générez des histoires personnalisées pour enfants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
				<div className="mx-auto max-w-5xl px-4 py-8">
					<header className="flex items-center justify-between">
						<a href="/" className="text-xl font-semibold">
							MagicReadKids
						</a>
						<nav className="text-sm">
							<a className="hover:underline" href="/abonnement">
								Abonnement
							</a>
							<span className="mx-3">·</span>
							<a className="hover:underline" href="/generate">
								Générer une histoire
							</a>
						</nav>
					</header>
					<main className="mt-10">{children}</main>
					<footer className="mt-16 text-center text-xs text-gray-500">
						<a className="hover:underline" href={process.env.NEXT_PUBLIC_BLOG_URL}>
							Blog
						</a>
						<span className="mx-2">•</span>
						<span>© {new Date().getFullYear()} MagicReadKids</span>
					</footer>
				</div>
			</body>
		</html>
	);
}


