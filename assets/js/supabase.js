// /assets/js/supabase.js
const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
