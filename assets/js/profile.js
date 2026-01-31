// assets/js/profile.js

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) return;

  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role") || "viewer";
  const username = sessionStorage.getItem("ntsh_user") || "viewer";

  // ===== BASIC UI =====
  document.getElementById("username").textContent = username;
  document.getElementById("role").textContent = role;

  const actions = document.getElementById("profileActions");
  const socials = document.getElementById("profileSocials");
  const gallery = document.getElementById("profileGallery");

  actions.innerHTML = "";
  socials.innerHTML = "";
  gallery.innerHTML = "";

  // ===== VIEWER =====
  if (role === "viewer") {
    actions.innerHTML = `
      <button onclick="window.location.href='/login.html'">
        Create Guest Account
      </button>
    `;
    return;
  }

  // ===== LOAD PROFILE DATA (GUEST / ARTIST / ADMIN) =====
  const { data: profile, error } = await window.supabase
    .from("profiles")
    .select("username, instagram, tiktok, approved, role")
    .eq("id", uid)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // ===== SOCIAL LINKS =====
  if (profile.instagram) {
    socials.innerHTML += `<a href="${profile.instagram}" target="_blank">Instagram</a>`;
  }
  if (profile.tiktok) {
    socials.innerHTML += `<a href="${profile.tiktok}" target="_blank">TikTok</a>`;
  }

  // ===== GUEST =====
  if (profile.role === "guest") {
    actions.innerHTML = `
      <p class="muted">
        ${profile.approved ? "Approved" : "Pending artist approval"}
      </p>
    `;
    return;
  }

  // ===== ARTIST =====
  if (profile.role === "artist") {
    actions.innerHTML = `
      <button onclick="openModal('uploadModal')">
        Upload Artwork
      </button>
    `;
    loadMyArt(uid);
  }

  // ===== ADMIN =====
  if (profile.role === "admin") {
    actions.innerHTML = `
      <button onclick="openModal('uploadModal')">
        Upload Artwork
      </button>
      <button onclick="window.location.href='/admin.html'">
        Admin Panel
      </button>
    `;
    loadMyArt(uid);
  }
});

/* ======================
   LOAD USER ART
====================== */

async function loadMyArt(uid) {
  const container = document.getElementById("profileGallery");

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, file_path, bucket, status")
    .eq("owner_id", uid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach((art) => {
    const url = window.supabase.storage
      .from(art.bucket)
      .getPublicUrl(art.file_path).data.publicUrl;

    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img src="${url}" />
      <strong>${art.title}</strong>
      <small>${art.status}</small>
    `;

    container.appendChild(card);
  });
}
