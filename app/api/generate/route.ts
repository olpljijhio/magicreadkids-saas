import { NextRequest, NextResponse } from "next/server";
import { generateChildrenStory } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
	try {
		const supabaseAdmin = getSupabaseAdmin();
		const body = await req.json();
		const { childName, age, theme, style, words, userEmail } = body as {
			childName: string;
			age: number;
			theme: string;
			style?: "adventure" | "fairy_tale" | "space" | "mystery";
			words?: number;
			userEmail?: string;
		};

		// TODO: Replace cookie/email with Supabase auth; expect user id from auth
		const cookieEmail = req.cookies.get("user_email")?.value;
		const email = userEmail || cookieEmail;
		if (!email) {
			return NextResponse.json({ error: "Missing user identity" }, { status: 400 });
		}

		// Lookup user and decrement one credit
		const { data: user } = await supabaseAdmin.from("users").select("id, credits").eq("email", email).single();
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		if (typeof user.credits === "number" && user.credits <= 0) {
			return NextResponse.json({ error: "No credits left" }, { status: 402 });
		}

		const story = await generateChildrenStory({ childName, age, theme, style, words });

		// Save story
		const { data: saved, error: insertError } = await supabaseAdmin
			.from("stories")
			.insert({
				user_id: user.id,
				child_id: null,
				title: story.title,
				content: story.content,
				theme,
			})
			.select()
			.single();
		if (insertError) {
			console.error("Failed to save story:", insertError);
			return NextResponse.json({ error: "Failed to save story" }, { status: 500 });
		}

		// Consume 1 credit
		await supabaseAdmin.rpc("consume_credit", { p_user_id: user.id, p_amount: 1 }).catch(() => undefined);

		return NextResponse.json({ story: saved });
	} catch (error) {
		console.error("Generate error:", error);
		return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
	}
}


