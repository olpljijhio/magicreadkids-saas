import { z } from "zod";

/**
 * Schéma de création d'histoire enfant
 */
export const storySchema = z.object({
  childName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom contient des caractères invalides"),

  age: z
    .number({
      invalid_type_error: "L’âge doit être un nombre",
    })
    .int("L’âge doit être un nombre entier")
    .min(0, "L’âge doit être positif")
    .max(18, "L’âge ne peut pas dépasser 18 ans"),

  theme: z.enum(
    [
      "aventure",
      "animaux",
      "espace",
      "magie",
      "princesses",
      "dinosaures",
      "pirates",
      "fees",
      "nature",
      "robots",
      "ocean",
    ],
    {
      errorMap: () => ({ message: "Thème invalide" }),
    }
  ),

  interests: z
    .string()
    .max(500, "Les centres d’intérêt ne peuvent pas dépasser 500 caractères")
    .optional(),

  storyLength: z.enum(["short", "medium", "long"]).default("medium"),
});

export type StoryInput = z.infer<typeof storySchema>;

/**
 * Schéma validation email
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(5, "Email trop court")
    .max(100, "Email trop long")
    .email("Format d’email invalide"),
});

/**
 * Schéma des avis / feedbacks
 */
export const feedbackSchema = z.object({
  storyId: z.string().uuid("ID d’histoire invalide"),
  rating: z
    .number({
      invalid_type_error: "La note doit être un nombre",
    })
    .int()
    .min(1, "La note doit être entre 1 et 5")
    .max(5, "La note doit être entre 1 et 5"),
  comment: z
    .string()
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
    .optional(),
});
