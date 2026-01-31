
// supabase-client.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make globally accessible (simple + safe)
window.supabase = supabase;

/**
 * Session helper
 */
export async function getSessionUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
