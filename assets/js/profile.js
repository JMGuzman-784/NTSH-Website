// assets/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");

  document.getElementById("username").textContent = user;
  document.getElementById("role").textContent = role;

  const actions = document.getElementById("profileActions");

  if (role === "viewer") {
    actions.innerHTML = `<button>Create Guest Account</button>`;
  }

  if (role === "guest" || role === "artist") {
    actions.innerHTML = `<button id="uploadArtBtn">Upload Artwork</button>`;
  }

  if (role === "admin") {
    actions.innerHTML = `
      <button id="uploadArtBtn">Upload Artwork</button>
      <a href="/admin.html" class="btn ghost">Admin Panel</a>
    `;
  }
});
