// assets/js/profile.js
document.addEventListener("DOMContentLoaded", async () => {
  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role");
  const username = sessionStorage.getItem("ntsh_user");

  if (!uid || !role) {
    window.location.href = "/index.html";
    return;
  }

  document.body.classList.add(`role-${role}`);

  const nameEl = document.getElementById("profileName");
  if (nameEl) nameEl.textContent = username;

  // Admin panel button visibility
  const adminBtn = document.getElementById("adminPanelBtn");
  if (adminBtn) {
    adminBtn.style.display = role === "admin" ? "inline-block" : "none";
  }

  // Viewer-specific UI
  if (role === "viewer") {
    const uploadBtn = document.getElementById("uploadArtBtn");
    if (uploadBtn) uploadBtn.remove();
  }
});
