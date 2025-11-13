import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe et est actif
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { 
          error: "Utilisateur non trouvé. Veuillez d'abord vous abonner.",
          needSubscription: true
        },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { 
          error: "Votre abonnement est inactif. Veuillez renouveler votre abonnement.",
          needSubscription: true
        },
        { status: 403 }
      );
    }

    // Créer un cookie de session
    const cookieStore = cookies();
    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    });

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        stories_remaining: user.stories_remaining,
        subscription_type: user.subscription_type,
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur login:", error.message);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}