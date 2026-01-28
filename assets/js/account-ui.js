/* =========================
   CONFIG
   ========================= */

const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";

const REQUIRE_LOGIN_ON_HOME = false;
let supabaseClient = null;

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase SDK not loaded");
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  wireMenu();
  wireUploadModal();

  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    if (REQUIRE_LOGIN_ON_HOME) window.location.href = "/";
    return;
  }

  await hydrateAccount(user);

  supabaseClient.auth.onAuthStateChange(async (_evt, session) => {
    if (!session?.user) {
      if (REQUIRE_LOGIN_ON_HOME) window.location.href = "/";
      return;
    }
    await hydrateAccount(session.user);
  });
});

/* =========================
   HEADER MENU
   ========================= */

function wireMenu() {
  const btn = document.getElementById("accountBtn");
  const menu = document.getElementById("accountMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove("open");
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "/";
  });

  settingsBtn?.addEventListener("click", () => {
    document.getElementById("settingsModal")?.classList.remove("hidden");
  });
}

/* =========================
   ACCOUNT HYDRATION
   ========================= */

async function hydrateAccount(user) {
  const avatar = document.getElementById("accountAvatar");
  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const badge = document.getElementById("roleBadge");

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("display_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "User";
  const username = profile?.username || "user";
  const role = (profile?.role || "viewer").toLowerCase();

  document.body.dataset.role = role;

  if (avatar) avatar.textContent = displayName[0]?.toUpperCase() || "?";
  if (nameEl) nameEl.textContent = displayName;
  if (userEl) userEl.textContent = `@${username}`;
  if (badge) {
    badge.textContent = role;
    badge.classList.toggle("artist", role === "artist");
    badge.classList.toggle("admin", role === "admin");
  }

  syncProfileUI(displayName, role, username);

  if (role === "artist" || role === "admin") {
    loadMyPendingArt();
  }

  const adminBtn = document.getElementById("adminPanelBtn");
  if (adminBtn) {
    adminBtn.style.display = role === "admin" ? "block" : "none";
  }
}

/* =========================
   PROFILE UI
   ========================= */

function syncProfileUI(displayName, role, username) {
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const artistActions = document.getElementById("artistActions");

  if (profileName) profileName.textContent = displayName;
  if (profileRole) profileRole.textContent = `${role} • NTSH`;

  if (artistActions) {
    artistActions.style.display =
      role === "artist" || role === "admin" ? "block" : "none";
  }

  if (username === "raid") {
    const ig = document.getElementById("igLink");
    const tt = document.getElementById("ttLink");
    if (ig && tt) {
      ig.href = "https://instagram.com/raids.art";
      tt.href = "https://tiktok.com/@raidtheofficial";
      ig.style.display = "inline";
      tt.style.display = "inline";
    }
  }
}

/* =========================
   UPLOAD MODAL
   ========================= */

function wireUploadModal() {
  const openBtn = document.getElementById("uploadBtn");
  const modal = document.getElementById("uploadModal");
  const cancelBtn = document.getElementById("cancelUpload");
  const submitBtn = document.getElementById("submitUpload");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    resetUploadForm();
  });

  submitBtn?.addEventListener("click", handleUploadSubmit);
}

function resetUploadForm() {
  const fileInput = document.getElementById("fileInput");
  const titleInput = document.getElementById("artTitle");
  const descInput = document.getElementById("artDescription");

  if (fileInput) fileInput.value = "";
  if (titleInput) titleInput.value = "";
  if (descInput) descInput.value = "";
}

/* =========================
   HANDLE UPLOAD
   ========================= */

async function handleUploadSubmit() {
  const fileInput = document.getElementById("fileInput");
  const titleInput = document.getElementById("artTitle");
  const descInput = document.getElementById("artDescription");

  const file = fileInput?.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

  const filePath = `${user.id}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("pending-art")
    .upload(filePath, file);

  if (uploadError) {
    alert("Upload failed.");
    return;
  }

  await supabaseClient.from("artworks").insert({
    owner_id: user.id,
    file_path: filePath,
    title: titleInput?.value.trim() || null,
    description: descInput?.value.trim() || null,
    status: "pending"
  });

  document.getElementById("uploadModal")?.classList.add("hidden");
  resetUploadForm();
  loadMyPendingArt();
}

/* =========================
   LOAD PENDING ART
   ========================= */

async function loadMyPendingArt() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: artworks } = await supabaseClient
    .from("artworks")
    .select("*")
    .eq("owner_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (!artworks || artworks.length === 0) {
    grid.innerHTML = `<p style="opacity:.6;">No pending uploads.</p>`;
    return;
  }

  for (const art of artworks) {
    const { data } = await supabaseClient.storage
      .from("pending-art")
      .createSignedUrl(art.file_path, 3600);

    const card = document.createElement("div");
    card.className = "art-card";

    const img = document.createElement("img");
    img.src = data.signedUrl;

    card.appendChild(img);
    grid.appendChild(card);
  }
}

/* =========================
   ADMIN APPROVAL
   ========================= */

async function approveArtwork(artworkId) {
  const { error } = await supabaseClient
    .from("artworks")
    .update({
      status: "approved",
      approved_at: new Date().toISOString()
    })
    .eq("id", artworkId);

  if (error) {
    alert("Failed to approve artwork.");
    return;
  }

  alert("Artwork approved.");
}
