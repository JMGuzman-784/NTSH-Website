// assets/js/modal.js

function openArtModal(art, imageUrl) {
  const modal = document.getElementById("artModal");
  modal.classList.remove("hidden");

  document.getElementById("modalImage").src = imageUrl;
  document.getElementById("modalTitle").textContent = art.title;

  modal.dataset.artId = art.id;
}

document.addEventListener("DOMContentLoaded", () => {
  const close = document.getElementById("closeModal");
  if (close) close.onclick = () =>
    document.getElementById("artModal").classList.add("hidden");
});
