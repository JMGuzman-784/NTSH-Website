document.addEventListener("DOMContentLoaded", () => {
  const role = NTSH.role;
  const user = NTSH.user;

  if (!role || !user) return;

  document.getElementById("accountName")?.textContent = user;
  document.getElementById("accountUser")?.textContent = `@${user}`;

  const roleMap = {
    viewer: "👀 viewer",
    guest: "🧍 guest",
    artist: "🎨 artist",
    admin: "🖥 admin",
  };

  document.getElementById("roleBadge")?.textContent = roleMap[role];
});
