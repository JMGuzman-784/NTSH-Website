// /assets/js/auth-gate.js

document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabase.createClient(
    "https://lworwldpziimhmcavjju.supabase.co",
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
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
