// /assets/js/account-ui.js
// UI role handling (safe on all pages)

document.addEventListener("ntsh:auth-ready", () => {
  const role = window.NTSH?.role || "viewer";
  const user = window.NTSH?.user || "viewer_001";

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

  if (roleBadge) {
    roleBadge.textContent = roleMap[role] || "👀 viewer";
  }

  // Hide elements by role
  document.querySelectorAll("[data-role]").forEach(el => {
    const allowed = el.dataset.role.split(",");
    if (!allowed.includes(role)) {
      el.remove();
    }
  });
});
