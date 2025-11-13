import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/utils";

let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Client Supabase côté serveur, utilisant la clé service role.
 * Ne jamais exposer cette clé côté client.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

    supabaseAdminClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
}
