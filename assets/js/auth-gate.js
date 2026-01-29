// /assets/js/auth-gate.js
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const page = document.body.dataset.page;

  if (page === "admin" && role !== "admin") {
    window.location.href = "/home.html";
  }

  if (page === "profile" && !role) {
    window.location.href = "/index.html";
  }
});
