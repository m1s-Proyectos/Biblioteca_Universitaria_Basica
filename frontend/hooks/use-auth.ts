import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function useAuthClient() {
  return createBrowserSupabaseClient();
}

