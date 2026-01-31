
// UMD-compatible Supabase client
const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("[Supabase] client ready");
