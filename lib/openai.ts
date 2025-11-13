import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY manquant dans .env.local");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modèle recommandé : gpt-4o-mini
// Autres options : gpt-4o, gpt-3.5-turbo
