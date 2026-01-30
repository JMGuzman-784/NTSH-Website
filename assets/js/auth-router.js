(() => {
  if (window.__NTSH_AUTH_ROUTER_LOADED__) return;
  window.__NTSH_AUTH_ROUTER_LOADED__ = true;

  console.log("[auth-router] loaded");

  const loginBtn = document.getElementById("enterLogin");
  const viewerBtn = document.getElementById("enterViewer");

  if (viewerBtn) {
    viewerBtn.addEventListener("click", () => {
      sessionStorage.setItem("ntsh_role", "viewer");
      window.location.href = "/home.html";
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login.html";
    });
  }
})();

  // VIEWER FLOW (no auth)
  if (viewerBtn) {
    viewerBtn.onclick = () => {
      sessionStorage.clear();
      sessionStorage.setItem("ntsh_role", "viewer");
      sessionStorage.setItem("ntsh_user", generateViewerName());
      window.location.href = "/home.html";
    };
  }


  console.log("[Router] Ready");


function generateViewerName() {
  const count = Number(localStorage.getItem("viewer_count") || 0) + 1;
  localStorage.setItem("viewer_count", count);
  return `viewer_${String(count).padStart(3, "0")}`;
}
