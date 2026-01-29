// /assets/js/auth.js
// Phase A: NO Supabase auth yet

(function () {
  if (window.NTSH_AUTH_LOADED) return;
  window.NTSH_AUTH_LOADED = true;

  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  // No auto-login, no redirects
  window.NTSH = {
    role: role || null,
    user: user || null,
    ready: true
  };
})();
