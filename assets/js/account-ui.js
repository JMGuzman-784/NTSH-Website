// /assets/js/account-ui.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  if (!role || !user) return;

  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const roleBadge = document.getElementById("roleBadge");

  if (nameEl) nameEl.textContent = user;
  if (userEl) userEl.textContent = `@${user}`;

  const roles = {
    viewer: "👀 viewer",
    guest: "🧍 guest",
    admin: "🖥 admin"
  };

  if (roleBadge) roleBadge.textContent = roles[role] || role;

  // Admin cleanup
  if (role === "admin") {
    document
      .querySelectorAll("#requestGuest, .request-guest")
      .forEach(el => el.remove());
  }

  console.log("[NTSH UI]", role, user);
});
