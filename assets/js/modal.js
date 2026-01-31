// assets/js/modal.js
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("uploadArtBtn");
  const modal = document.getElementById("uploadModal");
  const closeBtn = document.getElementById("closeUploadModal");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });
});
