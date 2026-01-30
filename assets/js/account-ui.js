// /assets/js/account-ui.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  if (!role || !user) return;

  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const roleBadge = document.getElementById("roleBadge");

  if (nameEl) nameEl.textContent = displayName(role, user);
  if (userEl) userEl.textContent = `@${user}`;
  if (roleBadge) roleBadge.textContent = roleIcon(role);
});

function roleIcon(role) {
  return {
    viewer: "👀 viewer",
    guest: "🧍 guest",
    artist: "🎨 artist",
    admin: "🖥 admin",
  }[role] || "viewer";
}

function displayName(role, user) {
  if (role === "admin") return "Raid";
  return user;
}
