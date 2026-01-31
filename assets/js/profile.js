// assets/js/profile.js
// Role-aware profile controller (Viewer / Guest / Artist / Admin)

document.addEventListener("DOMContentLoaded", async () => {
  // ===== SESSION STATE =====
  const uid = sessionStorage.getItem("ntsh_uid");
  const email = sessionStorage.getItem("ntsh_email");
  const role = sessionStorage.getItem("ntsh_role") || "viewer";
  const displayName =
    sessionStorage.getItem("ntsh_user") ||
    email?.split("@")[0] ||
    "Viewer";

  console.log("[PROFILE]", { uid, email, role, displayName });

  // ===== ELEMENTS =====
  const usernameEl = document.getElementById("username");
  const roleEl = document.getElementById("role");
  const socialsEl = document.getElementById("profileSocials");
  const actionsEl = document.getElementById("profileActions");
  const galleryEl = document.getElementById("profileGallery");

  const uploadBtn = document.getElementById("uploadArtBtn");
  const adminBtn = document.getElementById("adminPanelBtn");

  // ===== BASIC INFO =====
  if (usernameEl) usernameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = role;

  // ===== SOCIAL LINKS (STATIC FOR NOW) =====
  if (socialsEl) {
    socialsEl.innerHTML = `
      <a href="https://instagram.com/raidtheofficial" target="_blank">Instagram</a>
      <a href="https://tiktok.com/@raidtheofficial" target="_blank">TikTok</a>
    `;
  }

  // ===== RESET VISIBILITY =====
  uploadBtn && (uploadBtn.style.display = "none");
  adminBtn && (adminBtn.style.display = "none");
  actionsEl && (actionsEl.innerHTML = "");

  // ===== ROLE LOGIC =====

  // VIEWER
  if (role === "viewer") {
    actionsEl.innerHTML = `
      <button id="createGuestBtn">Create Guest Account</button>
    `;

    document
      .getElementById("createGuestBtn")
      ?.addEventListener("click", () => {
        window.location.href = "/login.html";
      });
  }

  // GUEST
  if (role === "guest") {
    actionsEl.innerHTML = `
      <button id="requestArtistBtn">Request Artist Access</button>
    `;

    document
      .getElementById("requestArtistBtn")
      ?.addEventListener("click", async () => {
        alert("Artist request sent (stub). Admin will review.");
        // Later: insert into requests table
      });
  }

  // ARTIST
  if (role === "artist") {
    uploadBtn && (uploadBtn.style.display = "inline-block");
  }

  // ADMIN (Raid only)
  if (role === "admin") {
    uploadBtn && (uploadBtn.style.display = "inline-block");
    adminBtn && (adminBtn.style.display = "inline-block");

    adminBtn.addEventListener("click", () => {
      window.location.href = "/admin.html";
    });
  }

  // ===== LOAD USER ARTWORK (OPTIONAL / SAFE) =====
  if (galleryEl && window.supabase && uid) {
    try {
      const { data, error } = await window.supabase
        .from("artworks")
        .select("*")
        .eq("owner_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        galleryEl.innerHTML = `<p class="muted">No artwork yet.</p>`;
        return;
      }

      galleryEl.innerHTML = data
        .map(
          (art) => `
          <div class="art-card">
            <h4>${art.title}</h4>
            <p class="muted">${art.status}</p>
          </div>
        `
        )
        .join("");
    } catch (err) {
      console.error("[PROFILE] gallery error", err.message);
    }
  }
});
