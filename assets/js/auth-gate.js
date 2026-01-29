// /assets/js/auth-gate.js

document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabase.createClient(
    "https://lworwldpziimhmcavjju.supabase.co",
    "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";
  );

  // 🔎 Check real auth session FIRST
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    // ✅ REAL USER EXISTS → go home
    window.location.href = "/home.html";
    return;
  }

  // ❌ NO AUTO VIEWER MODE HERE
  // Viewer is ONLY triggered by button click
});
