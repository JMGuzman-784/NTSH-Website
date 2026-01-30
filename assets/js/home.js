// assets/js/home.js

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  console.log("[HOME]", { role, user });

  const badge = document.getElementById("userBadge");
  if (!badge) return;

  badge.innerText = `${user} (${role})`;
});
