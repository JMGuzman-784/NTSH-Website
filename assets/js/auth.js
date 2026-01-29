// /assets/js/auth.js
// Single source of truth for auth + role

(function () {
  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co"; 
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao"; // keep as-is

  if (window.supabaseClient) return;

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  window.supabaseClient = supabase;

  // Global app state
  window.NTSH = {
    uid: null,
    user: "viewer_001",
    role: "viewer",
    ready: false,
  };

  supabase.auth.getSession().then(({ data }) => {
    const session = data?.session;

    if (session) {
      const user = session.user;

      window.NTSH.uid = user.id;
      window.NTSH.user =
        user.user_metadata?.username || "viewer_001";
      window.NTSH.role =
        user.user_metadata?.role || "viewer";

      sessionStorage.setItem("ntsh_uid", window.NTSH.uid);
      sessionStorage.setItem("ntsh_user", window.NTSH.user);
      sessionStorage.setItem("ntsh_role", window.NTSH.role);
    } else {
      // viewer fallback
      sessionStorage.setItem("ntsh_user", "viewer_001");
      sessionStorage.setItem("ntsh_role", "viewer");
    }

    window.NTSH.ready = true;
    document.dispatchEvent(new Event("ntsh:auth-ready"));
  });
})();
