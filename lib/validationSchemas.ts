// ============================================
// 🧠 MagicReadKids - Validation Schemas (Zod)
// Auteur : Élina
// Objectif : Valider toutes les données utilisateur
// Compatible Next.js / Supabase / Stripe
// ============================================

import { z } from "zod";

/* -----------------------------------------------------------
 * 🧒 SCHEMA : Création d'une histoire personnalisée
 * ----------------------------------------------------------- */
export const storySchema = z.object({
  childName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le prénom ne doit contenir que des lettres et des espaces."
    ),

  age: z
    .number({
      invalid_type_error: "L'âge doit être un nombre entier.",
      required_error: "Veuillez indiquer l'âge de l'enfant."
    })
    .int()
    .min(1, "L'âge doit être supérieur à 0.")
    .max(18, "L'âge ne peut pas dépasser 18 ans."),

  theme: z.enum(
    [
      "aventure",
      "animaux",
      "espace",
      "magie",
      "princesses",
      "dinosaures",
      "pirates",
      "fées",
      "nature",
      "robots",
      "océan"
    ],
    { errorMap: () => ({ message: "Veuillez choisir un thème valide." }) }
  ),

  interests: z
    .string()
    .max(300, "Les centres d'intérêt ne doivent pas dépasser 300 caractères.")
    .optional(),

  storyLength: z
    .enum(["short", "medium", "long"])
    .default("medium")
});

/** ✅ Type automatique généré à partir du schéma */
export type StoryInput = z.infer<typeof storySchema>;

/* -----------------------------------------------------------
 * 📧 SCHEMA : Validation d'email
 * ----------------------------------------------------------- */
export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("L'adresse e-mail n'est pas valide.")
    .min(5, "Adresse e-mail trop courte.")
    .max(100, "Adresse e-mail trop longue.")
});

/** ✅ Type pour l’email */
export type EmailInput = z.infer<typeof emailSchema>;

/* -----------------------------------------------------------
 * 💬 SCHEMA : Feedback utilisateur
 * ----------------------------------------------------------- */
export const feedbackSchema = z.object({
  storyId: z
    .string()
    .uuid("Identifiant d’histoire invalide.")
    .nonempty("L'ID de l'histoire est requis."),

  rating: z
    .number({
      invalid_type_error: "La note doit être un nombre.",
      required_error: "Veuillez attribuer une note entre 1 et 5."
    })
    .int()
    .min(1, "La note minimale est 1.")
    .max(5, "La note maximale est 5."),

  comment: z
    .string()
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères.")
    .optional()
});

/** ✅ Type pour les retours utilisateurs */
export type FeedbackInput = z.infer<typeof feedbackSchema>;

/* -----------------------------------------------------------
 * 🧩 UTILITAIRE : Validation sécurisée
 * ----------------------------------------------------------- */
/**
 * Valide une donnée selon un schéma et renvoie une erreur propre.
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; error?: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  return { success: true, data: result.data };
}
