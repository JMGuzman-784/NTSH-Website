// assets/js/auth.js

(function () {
  const client = window.supabaseClient;

  if (!client) {
    console.warn("[Auth] Supabase client missing");
    return;
  }

  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  window.NTSH = {
    role: role || "viewer",
    user: user || null,
    ready: true
  };

  console.log("[NTSH Phase A] Auth loaded:", window.NTSH);
})();
