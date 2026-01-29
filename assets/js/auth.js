// /assets/js/auth.js
// Phase A: No Supabase auth, no sessions, no redirects

(() => {
  if (window.__NTSH_AUTH__) return;
  window.__NTSH_AUTH__ = true;

  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  window.NTSH = {
    role: role || null,
    user: user || null,
    ready: true
  };

  console.log("[NTSH Phase A] Auth loaded:", window.NTSH);
})();
