// assets/js/auth-guard.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  const path = window.location.pathname;

  if (!role && path !== "/index.html" && path !== "/login.html") {
    window.location.href = "/index.html";
    return;
  }

  if (role === "viewer" && path === "/admin.html") {
    window.location.href = "/home.html";
  }
});
