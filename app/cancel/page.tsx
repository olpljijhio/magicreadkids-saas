export default function CancelPage() {
	return (
		<div className="mx-auto max-w-md text-center">
			<h1 className="text-2xl font-bold">Paiement annulé</h1>
			<p className="mt-2 text-gray-700">Votre paiement a été annulé. Vous pouvez réessayer à tout moment.</p>
			<a href="/abonnement" className="mt-6 inline-block underline">
				Retour aux plans
			</a>
		</div>
	);
}


