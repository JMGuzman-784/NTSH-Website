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

document.getElementById("viewerBtn")?.addEventListener("click", () => {
  sessionStorage.setItem("ntsh_role", "viewer");
  sessionStorage.setItem("ntsh_user", "viewer_001");
  window.location.href = "/home.html";
});

  
  // ❌ NO AUTO VIEWER MODE HERE
  // Viewer is ONLY triggered by button click
});
