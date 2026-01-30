// /assets/js/auth-router.js
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const viewerBtn = document.getElementById("enterViewer");
  const loginBtn = document.getElementById("enterLogin");

  // VIEWER FLOW (no auth)
  if (viewerBtn) {
    viewerBtn.onclick = () => {
      sessionStorage.clear();
      sessionStorage.setItem("ntsh_role", "viewer");
      sessionStorage.setItem("ntsh_user", generateViewerName());
      window.location.href = "/home.html";
    };
  }

  // LOGIN FLOW
  const loginBtn = document.getElementById("enterLogin");

if (loginBtn) {
  loginBtn.onclick = () => {
    window.location.href = "/login.html";
  };
}


  console.log("[Router] Ready");
});

function generateViewerName() {
  const count = Number(localStorage.getItem("viewer_count") || 0) + 1;
  localStorage.setItem("viewer_count", count);
  return `viewer_${String(count).padStart(3, "0")}`;
}
