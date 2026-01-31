// profile.js
import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameEl = document.getElementById("username");
  const roleEl = document.getElementById("role");
  const actions = document.getElementById("profileActions");

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return;

  const role = user.user_metadata?.role || "guest";
  const name = user.user_metadata?.username || user.email;

  usernameEl.textContent = name;
  roleEl.textContent = role;

  actions.innerHTML = "";

  if (role === "guest") {
    actions.innerHTML += `<button>Request Artist Access</button>`;
  }

  if (role === "artist" || role === "admin") {
    actions.innerHTML += `<button id="uploadArtBtn">Upload Artwork</button>`;
  }

  if (role === "admin") {
    actions.innerHTML += `<a href="/admin.html">Admin Panel</a>`;
  }
});
