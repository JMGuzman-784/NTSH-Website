
// /assets/js/auth.js
document.addEventListener("DOMContentLoaded", async () => {
  if (window.supabaseClient) return;
  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co"; 
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao"; // keep as-is
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
