import { redirect } from "next/navigation";

export const metadata = { title: "S’inscrire – MagicReadKids" };

export default function Page() {
  // Redirection immédiate vers l’offre
  redirect("/abonnement");
}