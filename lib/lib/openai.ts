import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChildrenStory(params: {
  childName: string;
  age: number;
  theme: string;
  interests?: string;
}) {
  const { childName, age, theme, interests } = params;

  const prompt = `Crée une histoire pour ${childName}, ${age} ans.
Thème: ${theme}
${interests ? `Centres d'intérêt: ${interests}` : ""}

L'histoire doit être adaptée à un enfant de ${age} ans avec une fin heureuse.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "Tu es un conteur d'histoires pour enfants." },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || "";
}
