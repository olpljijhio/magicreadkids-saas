import { Button } from "@/components/ui/Button";

export default function Page() {
	return (
		<section className="grid gap-8 md:grid-cols-2 items-center">
			<div>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					Des histoires personnalisées pour éveiller l’imagination des enfants
				</h1>
				<p className="mt-4 text-gray-700">
					MagicReadKids crée des histoires sur mesure en quelques secondes, adaptées à l’âge, au prénom et aux centres
					d’intérêt de votre enfant.
				</p>
				<div className="mt-6 flex gap-3">
					<a href="/abonnement">
						<Button>Découvrir les plans</Button>
					</a>
					<a href="/generate">
						<Button variant="outline">Essayer maintenant</Button>
					</a>
				</div>
			</div>
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<p className="font-medium">Comment ça marche ?</p>
				<ol className="mt-3 list-decimal pl-5 space-y-1 text-sm text-gray-700">
					<li>Choisissez un thème et l’âge de l’enfant</li>
					<li>L’IA génère une histoire douce et adaptée</li>
					<li>Enregistrez, relisez, partagez</li>
				</ol>
			</div>
		</section>
	);
}


