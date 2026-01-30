
// assets/js/supabase-client.js

// 🔒 SINGLE Supabase initialization
// Do NOT redeclare this anywhere else

const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("[Supabase] client initialized");
