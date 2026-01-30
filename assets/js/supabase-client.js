
 // assets/js/supabase-client.js
// SINGLE SOURCE OF TRUTH FOR SUPABASE

(function () {
  // Prevent double initialization
  if (window.supabase) return;

  const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

  if (!window.supabaseJs && !window.supabase) {
    console.error("Supabase SDK not loaded");
    return;
  }

  // UMD build exposes `supabase`
  window.supabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("[NTSH] Supabase client initialized");
})();
