
// /assets/js/auth.js
document.addEventListener("DOMContentLoaded", async () => {
  if (window.supabaseClient) return;
  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co"; 
  const supabaseKey = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP"; // keep as-is
 // keep anon key only

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  window.supabaseClient = supabase;

  const { data } = await supabase.auth.getSession();

  const session = data.session;

  window.NTSH = {
    uid: session?.user?.id || null,
    user: session?.user?.user_metadata?.username || "viewer_001",
    role: session?.user?.user_metadata?.role || "viewer",
    ready: true,
  };

  sessionStorage.setItem("ntsh_uid", window.NTSH.uid);
  sessionStorage.setItem("ntsh_user", window.NTSH.user);
  sessionStorage.setItem("ntsh_role", window.NTSH.role);

  document.dispatchEvent(new Event("ntsh:auth-ready"));
});
