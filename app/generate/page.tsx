"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { StoryCard } from "@/components/StoryCard";
import { Loader } from "@/components/Loader";

export default function GeneratePage() {
	const [email, setEmail] = useState("");
	const [childName, setChildName] = useState("");
	const [age, setAge] = useState<number>(6);
	const [theme, setTheme] = useState("animaux");
	const [style, setStyle] = useState<"adventure" | "fairy_tale" | "space" | "mystery">("adventure");
	const [isLoading, setIsLoading] = useState(false);
	const [story, setStory] = useState<{ title: string; content: string; theme?: string } | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onGenerate() {
		setIsLoading(true);
		setError(null);
		setStory(null);
		try {
			// TODO: Replace cookie/email with Supabase auth
			document.cookie = `user_email=${encodeURIComponent(email)}; path=/; max-age=86400`;
			const res = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ childName, age, theme, style, userEmail: email }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error || "Échec de génération");
			}
			setStory({ title: data.story.title, content: data.story.content, theme: data.story.theme });
		} catch (e: any) {
			setError(e?.message || "Erreur inconnue");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="grid gap-8 md:grid-cols-2">
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Générer une histoire</h1>
				<div>
					<label className="block text-sm font-medium mb-2">Votre email</label>
					<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Prénom de l’enfant</label>
					<Input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Léa" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Âge</label>
					<Input type="number" value={age} min={3} max={12} onChange={(e) => setAge(Number(e.target.value || 6))} />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Thème</label>
					<Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="animaux, magie, espace..." />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Style</label>
					<Select value={style} onChange={(e) => setStyle(e.target.value as any)}>
						<option value="adventure">Aventure</option>
						<option value="fairy_tale">Conte</option>
						<option value="space">Espace</option>
						<option value="mystery">Mystère</option>
					</Select>
				</div>
				<Button onClick={onGenerate} isLoading={isLoading}>
					{isLoading ? <Loader label="Génération en cours..." /> : "Générer"}
				</Button>
				<p className="text-xs text-gray-500">
					Connexion à venir via Supabase Auth. Utilisation d’un cookie temporaire.
				</p>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
			</div>
			<div className="space-y-4">
				{story ? (
					<>
						<h2 className="text-lg font-semibold">Aperçu</h2>
						<StoryCard story={{ title: story.title, content: story.content, theme }} />
					</>
				) : (
					<div className="text-sm text-gray-600">L’aperçu de l’histoire apparaîtra ici.</div>
				)}
			</div>
		</div>
	);
}


