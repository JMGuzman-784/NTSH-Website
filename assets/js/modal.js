// assets/js/modal.js

window.openModal = (id) => {
  document.getElementById(id)?.classList.remove("hidden");
};

window.closeModal = (id) => {
  document.getElementById(id)?.classList.add("hidden");
};

document.addEventListener("click", (e) => {
  if (e.target.id === "closeUpload") {
    closeModal("uploadModal");
  }
});
