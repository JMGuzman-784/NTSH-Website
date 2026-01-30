
// assets/js/supabase-client.js
window.NTSH = window.NTSH || {};

NTSH.supabase = supabase.createClient(
  "https://lworwldpziimhmcavjju.supabase.co",
  "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP"
);

console.log("[Supabase] client initialized");
