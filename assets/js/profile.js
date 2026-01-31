// assets/js/profile.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const name = sessionStorage.getItem("ntsh_user");

  document.getElementById("profileName").textContent = name || "Viewer";
  document.getElementById("profileRole").textContent = role || "viewer";

  // Hide everything by default
  document.querySelectorAll("[data-role]").forEach(el => {
    el.style.display = "none";
  });

  // Role-based reveal
  document.querySelectorAll(`[data-role~="${role}"]`).forEach(el => {
    el.style.display = "block";
  });

  // Admin hard lock
  if (role === "admin" && name === "Raid") {
    document.getElementById("adminPanelBtn")?.style.display = "block";
  }
});
