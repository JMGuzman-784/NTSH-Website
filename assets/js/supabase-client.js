
// /assets/js/supabase-client.js
(() => {
  if (window.supabaseClient) return;

  const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("[Supabase] client initialized");
})();
