// /assets/js/supabase.js
const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
  );
  console.log("[Supabase] client initialized");
}
