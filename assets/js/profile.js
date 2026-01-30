// /assets/js/profile.js
document.addEventListener("DOMContentLoaded", async () => {
  
  const uid = sessionStorage.getItem("ntsh_uid");
  window.supabase = window.supabaseClient;

  if (!supabase || !uid) return;

  if (role === "viewer") {
    document.querySelectorAll(".upload-btn").forEach(b => b.remove());
  }

  if (role === "artist") {
    // allow delete own art
  }
});
