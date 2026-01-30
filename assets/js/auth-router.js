// assets/js/auth-router.js
// Page protection ONLY — no auth, no login

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");
  const path = window.location.pathname;

  console.log("[Router] State:", { role, user, path });

  // Protect admin page
  if (path.includes("admin.html") && role !== "admin") {
    alert("Unauthorized");
    window.location.href = "/home.html";
  }

  // Protect profile page
  if (path.includes("profile.html") && !role) {
    window.location.href = "/index.html";
  }
});
