import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "./utils";

let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 * DO NOT import this into client-side components. Server-only.
 */
export function getSupabaseAdmin(): SupabaseClient {
	if (!supabaseAdminClient) {
		supabaseAdminClient = createClient(
			getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
			getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
				global: {
					headers: {
						"X-Client-Info": "magicreadkids-saas-admin",
					},
				},
			}
		);
	}
	return supabaseAdminClient;
}


