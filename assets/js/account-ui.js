// /assets/js/account-ui.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role") || "viewer";
  const user = sessionStorage.getItem("ntsh_user") || "viewer_001";

  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const roleBadge = document.getElementById("roleBadge");

  if (nameEl) nameEl.textContent = user;
  if (userEl) userEl.textContent = `@${user}`;

  const roleMap = {
    viewer: "👀 viewer",
    guest: "🧍 guest",
    artist: "🎨 artist",
    admin: "🖥 admin",
  };

  if (roleBadge) roleBadge.textContent = roleMap[role];

  // Hide admin-only or guest-only buttons
  if (role === "admin") {
    document.querySelectorAll(".request-guest").forEach(b => b.remove());
  }
});
