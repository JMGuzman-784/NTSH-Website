// /assets/js/viewer.js
// Viewer-only restrictions (NO auth, NO supabase)

document.addEventListener("ntsh:auth-ready", () => {
  const role = window.NTSH?.role || "viewer";

  // Only apply restrictions if viewer
  if (role !== "viewer") return;

  // Hide upload buttons
  document.querySelectorAll(
    "#uploadBtn, .upload-btn, .artist-only"
  ).forEach(el => el.remove());

  // Hide admin buttons
  document.querySelectorAll(
    "#adminPanelBtn, .admin-only"
  ).forEach(el => el.remove());

  // Disable reactions if needed later (visual only for now)
  document.querySelectorAll("[data-react]").forEach(btn => {
    btn.disabled = false; // viewers CAN react
  });

  // Prevent comments (handled in modal later)
  document.body.dataset.viewer = "true";
});
