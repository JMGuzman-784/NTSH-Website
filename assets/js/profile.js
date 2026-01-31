// assets/js/profile.js
import { getState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = getState();
  if (!state) return;

  const usernameEl = document.getElementById("username");
  const roleEl = document.getElementById("role");
  const actions = document.getElementById("profileActions");

  if (usernameEl) usernameEl.textContent = state.username;
  if (roleEl) roleEl.textContent = "👀 Viewer";

  if (actions) {
    actions.innerHTML = `
      <p>You are browsing as a viewer.</p>
      <a href="/login.html" class="btn primary">Become an NTSH Member</a>
    `;
  }
});
