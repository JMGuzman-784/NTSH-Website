
// /assets/js/modal.js
const modal = document.getElementById("artModal");

window.openModal = function (art) {
  modal.classList.remove("hidden");

  modal.innerHTML = `
    <button onclick="closeModal()">✕</button>
    <img src="${art.image_url}" />
    <h2>${art.title}</h2>
    <p>by ${art.artist}</p>

    <div class="reactions">
      ${renderReactions(art)}
    </div>

    ${renderComments(art)}
  `;
};

window.closeModal = function () {
  modal.classList.add("hidden");
};

function renderReactions(art) {
  if (NTSH.role === "viewer") {
    return `<p>Sign in to react</p>`;
  }
  return `⭐ 🔥 💎 😍 👍`;
}

function renderComments(art) {
  if (NTSH.role === "viewer") {
    return `<p>Comments disabled</p>`;
  }
  return `
    <div class="comments">
      <textarea placeholder="Write a comment"></textarea>
      <button>Post</button>
    </div>
  `;
}
