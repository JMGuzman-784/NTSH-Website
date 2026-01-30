// /assets/js/router.js
// Lightweight page access rules

document.addEventListener("DOMContentLoaded", () => {
  const role = window.NTSH_STATE?.role || "viewer";
  const page = document.body.dataset.page;

  // Admin page guard
  if (page === "admin" && role !== "admin") {
    alert("Admins only.");
    window.location.href = "/home.html";
    return;
  }

  // Profile page guard (viewer allowed, limited later)
  if (page === "profile" && !role) {
    window.location.href = "/index.html";
  }
});
