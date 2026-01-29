
 // /assets/js/auth-gate.js

document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co";
  const supabaseKey = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP"; // sb_publishable_...

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const viewerBtn = document.getElementById("viewerBtn");
  const guestBtn = document.getElementById("guestBtn");
  const loginBtn = document.getElementById("loginBtn");

  // ---- VIEWER ----
  viewerBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", `viewer_${Math.floor(Math.random() * 1000)}`);
    window.location.href = "/home.html";
  };

  // ---- GUEST ----
  guestBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "guest");
    sessionStorage.setItem("ntsh_user", `guest_${Math.floor(Math.random() * 1000)}`);
    window.location.href = "/home.html";
  };

  // ---- LOGIN (real auth later) ----
  loginBtn.onclick = () => {
    window.location.href = "/login.html"; // Phase B
  };
});
