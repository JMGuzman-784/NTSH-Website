// /assets/js/auth-gate.js
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[Gate] Ready");

  const viewerBtn = document.getElementById("enterViewer");
  const guestBtn  = document.getElementById("enterGuest");
  const loginBtn  = document.getElementById("enterLogin");

  // If user already logged in via Supabase → redirect
  const { data } = await window.supabaseClient.auth.getSession();
  if (data.session) {
    console.log("[Gate] Supabase session found → redirecting");
    window.location.href = "/home.html";
    return;
  }

  // Viewer = temporary
  viewerBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", "viewer_001");
    window.location.href = "/home.html";
  };

  // Guest = temporary (NOT admin, NOT artist)
  guestBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "guest");
    sessionStorage.setItem("ntsh_user", "guest_001");
    window.location.href = "/home.html";
  };

  // Login = Supabase handles everything
  loginBtn.onclick = () => {
    window.location.href = "/login.html";
  };
});
