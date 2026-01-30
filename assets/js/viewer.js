// /assets/js/viewer.js
// Viewer identity + numbering

document.addEventListener("DOMContentLoaded", () => {
  // Only run on index or home
  const page = document.body.dataset.page;
  if (!["index", "home"].includes(page)) return;

  // If already a member, do nothing
  const existingRole = sessionStorage.getItem("ntsh_role");
  if (existingRole && existingRole !== "viewer") return;

  // Assign viewer if none exists
  if (!existingRole) {
    let count = Number(localStorage.getItem("ntsh_viewer_count") || 0);
    count += 1;

    localStorage.setItem("ntsh_viewer_count", count.toString());

    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", `viewer_${String(count).padStart(3, "0")}`);
  }
});
