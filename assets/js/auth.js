// ---- Supabase init (fill these in) ----
// /assets/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";

  if (window.supabaseClient) return;

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  window.supabaseClient = supabase;

  supabase.auth.getSession().then(({ data }) => {
    if (!data.session) return;

    const user = data.session.user;

    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem(
      "ntsh_user",
      user.user_metadata?.username || "viewer_001"
    );
    sessionStorage.setItem(
      "ntsh_role",
      user.user_metadata?.role || "viewer"
    );
  });
});
