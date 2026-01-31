document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  const actions = document.getElementById("profileActions");
  const gallery = document.getElementById("profileGallery");
  const socials = document.getElementById("profileSocials");

  if (role === "viewer") {
    document.getElementById("profileName").textContent = "Viewer";
    document.getElementById("profileRole").textContent = "Viewer";

    actions.innerHTML = `
      <p class="muted">
        You’re browsing as a viewer.
        Create an NTSH account to react, comment, or upload artwork.
      </p>
      <a href="/login.html" class="btn primary">
        Continue as NTSH Member
      </a>
    `;

    socials.style.display = "none";
    gallery.style.display = "none";

    return; // ⛔ stop here — viewer gets nothing else
  }

  // ↓ everything below this is for guest / artist / admin only
});


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
