// assets/js/profile.js
document.addEventListener("DOMContentLoaded", async () => {
  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role");
  const name = sessionStorage.getItem("ntsh_user");

  if (!uid) return;

  document.getElementById("profileName").textContent = name;
  document.getElementById("profileRole").textContent = role;

  // Upload access
  if (role !== "viewer") {
    document.getElementById("uploadArtBtn")?.classList.remove("hidden");
  }

  // Admin-only
  if (role === "admin" && name === "Raid") {
    document.getElementById("adminPanelBtn")?.classList.remove("hidden");
  }
});
