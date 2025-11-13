import OpenAI from "openai";
import { getRequiredEnv } from "@/lib/utils";

let client: OpenAI | null = null;

export interface GenerateStoryParams {
  childName: string;
  age: number;
  theme: string;
  interests?: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
}

/**
 * Singleton OpenAI client.
 */
export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: getRequiredEnv("OPENAI_API_KEY"),
    });
  }
  return client;
}

/**
 * Génère une histoire pour enfant, en français, à partir de quelques paramètres.
 */
export async function generateChildrenStory(
  params: GenerateStoryParams
): Promise<GeneratedStory> {
  const { childName, age, theme, interests } = params;

  const prompt = [
    `Écris une histoire pour enfant en français.`,
    `Enfant: ${childName}, ${age} ans.`,
    `Thème principal: ${theme}.`,
    interests && interests.length > 0
      ? `Centres d'intérêt: ${interests}.`
      : "",
    `L'histoire doit être positive, adaptée à l'âge, avec une fin heureuse.`,
    `Structure: un titre sur la première ligne, puis l'histoire sur les lignes suivantes.`
  ]
    .filter((part) => Boolean(part))
    .join(" ");

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 800,
    messages: [
      {
        role: "system",
        content:
          "Tu es un conteur bienveillant qui écrit des histoires adaptées aux enfants.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const title = lines[0] || "Histoire pour enfant";
  const content = lines.slice(1).join("\n") || text;

  return {
    title: title.replace(/^#+\s*/, "").slice(0, 200),
    content,
  };
}
