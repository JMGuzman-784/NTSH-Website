// /assets/js/modal.js
function openArtModal(art) {
  const modal = document.getElementById("artModal");
  modal.querySelector("img").src = art.public_url;
  modal.querySelector(".title").textContent = art.title;
  modal.classList.add("open");
}
