
// assets/js/supabase-client.js
// SINGLE SOURCE OF TRUTH — DO NOT REDECLARE ANYWHERE

(function () {
  if (window.supabase) {
    console.warn("[Supabase] Client already exists");
    return;
  }

  const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";


  window.supabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("[Supabase] Client initialized");
})();
