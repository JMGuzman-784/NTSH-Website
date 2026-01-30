
// assets/js/viewer.js
// Anonymous viewer logic

document.addEventListener("DOMContentLoaded", () => {
  const viewerBtn = document.getElementById("continueViewer");
  if (!viewerBtn) return;

  viewerBtn.addEventListener("click", () => {
    let count = Number(localStorage.getItem("viewerCount") || 0);
    count += 1;

    localStorage.setItem("viewerCount", count);

    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", `viewer_${String(count).padStart(3, "0")}`);

    console.log("[VIEWER]", count);
    window.location.href = "/home.html";
  });
});
