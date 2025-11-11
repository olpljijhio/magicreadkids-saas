import OpenAI from "openai";
import { getRequiredEnv } from "./utils";

/**
 * OpenAI client for server-side story generation
 */
export const openai = new OpenAI({
	apiKey: getRequiredEnv("OPENAI_API_KEY"),
});

export async function generateChildrenStory(params: {
	childName: string;
	age: number;
	theme: string;
	style?: "adventure" | "fairy_tale" | "space" | "mystery";
	words?: number;
}): Promise<{ title: string; content: string }> {
	const { childName, age, theme, style = "adventure", words = 500 } = params;

	const system = [
		"You are a helpful assistant that writes engaging, age-appropriate children's stories in French.",
		"Stories must be wholesome, positive, and suitable for the provided age.",
		"Use simple sentences and vivid imagery. Include a clear beginning, middle, and end.",
	].join(" ");

	const user = [
		`Écris une histoire pour enfant en français.`,
		`Enfant: ${childName}, âge: ${age}.`,
		`Thème: ${theme}.`,
		`Style: ${style}.`,
		`Longueur: ~${words} mots.`,
		`Structure: renvoie JSON avec "title" et "content".`,
	].join(" ");

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		temperature: 0.7,
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: user },
		],
	});

	const text = response.choices[0]?.message?.content || "";
	// Some models may not consistently return JSON; fallback to simple parsing
	try {
		const parsed = JSON.parse(text) as { title: string; content: string };
		if (parsed?.title && parsed?.content) return parsed;
	} catch {
		// noop
	}
	// Fallback: synthesize title and keep full text as content
	const firstLine = text.split("\n").find((l) => l.trim().length > 0) || "Histoire pour enfant";
	return { title: firstLine.replace(/^#+\s*/, "").slice(0, 120), content: text };
}


