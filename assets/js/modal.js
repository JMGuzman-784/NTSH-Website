// /assets/js/modal.js
function openArtModal(art) {
  let modal = document.getElementById("artModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "artModal";
    modal.className = "art-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close">✕</button>
        <img />
        <h2 class="title"></h2>
        <p class="description"></p>
        <div class="comments"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.querySelector("img").src = art.public_url;
  modal.querySelector(".title").textContent = art.title;
  modal.querySelector(".description").textContent =
    art.description || "";

  modal.classList.add("open");

  modal.querySelector(".close").onclick = () => {
    modal.classList.remove("open");
  };
}
