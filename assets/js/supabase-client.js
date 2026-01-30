
  const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";


if (!window.supabaseClient) {
  window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
