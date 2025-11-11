export default function SuccessPage() {
	return (
		<div className="mx-auto max-w-md text-center">
			<h1 className="text-2xl font-bold">Merci ! 🎉</h1>
			<p className="mt-2 text-gray-700">Votre paiement a été confirmé. Votre abonnement est actif.</p>
			<a href="/generate" className="mt-6 inline-block underline">
				Commencer à générer des histoires
			</a>
		</div>
	);
}


