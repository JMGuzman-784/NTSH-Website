// assets/js/router.js
// Decides where users go AFTER login / viewer entry

import { loadState } from "./state.js";

export function routeAfterLogin() {
  const state = loadState();

  console.log("[ROUTER] Routing user", state);

  // Everyone goes to home
  window.location.href = "/home.html";
}

// assets/js/router.js
import { setViewer } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const viewerBtn = document.getElementById("continueViewer");

  if (viewerBtn) {
    viewerBtn.addEventListener("click", () => {
      setViewer();
      window.location.href = "/home.html";
    });
  }
});


export function enterAsViewer() {
  sessionStorage.clear();

  const count = Number(localStorage.getItem("ntsh_viewer_count") || 0) + 1;
  localStorage.setItem("ntsh_viewer_count", count);

  sessionStorage.setItem("ntsh_role", "viewer");
  sessionStorage.setItem("ntsh_user", `viewer_${String(count).padStart(3, "0")}`);
  sessionStorage.setItem("ntsh_uid", `viewer-${Date.now()}`);

  console.log("[ROUTER] Viewer entry", count);
  window.location.href = "/home.html";
}
