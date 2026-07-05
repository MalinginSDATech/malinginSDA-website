import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "https://acacsvkvpxguonhkgfcz.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_NZGONHLeMOmticO7YvVK8A_XzY-3WMR";

export const isSupabaseReady =
  !!url && url !== "your-project-url" && !!key;

// Separate storage keys keep the admin panel and the member-facing Give page
// on independent sessions — signing in on one must not sign you into the other.
export const supabase = isSupabaseReady
  ? createClient(url, key, { auth: { storageKey: "sb-admin-auth" } })
  : null!;

export const supabaseMember = isSupabaseReady
  ? createClient(url, key, { auth: { storageKey: "sb-member-auth" } })
  : null!;
