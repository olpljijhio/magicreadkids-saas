import { NextRequest, NextResponse } from "next/server";
import { storySchema } from "@/lib/validation";
import { sanitizeHTML } from "@/lib/sanitize";
import { storyRateLimiter, checkRateLimitFallback } from "@/lib/rate-limit";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.ip ?? "anonymous";

    let rateLimitOk = true;
    if (storyRateLimiter) {
      const { success } = await storyRateLimiter.limit(ip);
      rateLimitOk = success;
    } else {
      const { success } = await checkRateLimitFallback(ip, 3, 3600000);
      rateLimitOk = success;
    }

    if (!rateLimitOk) {
      return NextResponse.json(
        {
          error: "Trop de requêtes. Veuillez réessayer dans une heure.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // 2. Validation des inputs
    const body = await request.json();
    const validation = storySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { childName, age, theme, interests, storyLength } = validation.data;

    // 3. Générer l’histoire avec OpenAI
    const prompt = `Crée une histoire ${
      storyLength === "short"
        ? "courte (200 mots)"
        : storyLength === "long"
        ? "longue (800 mots)"
        : "moyenne (500 mots)"
    } pour ${childName}, ${age} ans.
Thème: ${theme}
${interests ? `Centres d'intérêt: ${interests}` : ""}

L’histoire doit :
- Être adaptée à un enfant de ${age} ans
- Véhiculer des valeurs positives (courage, empathie, amitié)
- Avoir une fin heureuse
- Être écrite en français avec un vocabulaire adapté
- Mettre ${childName} comme personnage principal

Format : Titre suivi de l’histoire.`;

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens:
        storyLength === "short"
          ? 500
          : storyLength === "long"
          ? 1500
          : 1000,
      messages: [
        {
          role: "system",
          content:
            "Tu es un conteur d'histoires pour enfants bienveillant et créatif.",
        },
        { role: "user", content: prompt },
      ],
    });

    const generationTime = Date.now() - startTime;
    const rawContent = completion.choices[0]?.message?.content || "";

    // 4. Sanitisation du contenu
    const lines = rawContent.split("\n");
    const title = sanitizeHTML(lines[0].replace(/^#+\s*/, "").trim());
    const content = sanitizeHTML(lines.slice(1).join("\n").trim());

    // 5. Retourner la réponse sécurisée
    return NextResponse.json({
      success: true,
      story: {
        title,
        content,
        childName,
        childAge: age,
        theme,
        generationTime,
        tokensUsed: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error) {
    console.error("Erreur génération:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de la génération de l’histoire",
        code: "GENERATION_ERROR",
      },
      { status: 500 }
    );
  }
}

