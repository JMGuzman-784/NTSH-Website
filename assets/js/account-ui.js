/* =========================
   CONFIG
   ========================= */

const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";
/* =========================
   SUPABASE CONFIG
   ========================= */

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
}

/* =========================
   ACCOUNT HYDRATION
   ========================= */

async function hydrateAccount(user) {
  const avatar = document.getElementById("accountAvatar");
  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const badge = document.getElementById("roleBadge");

  if (!avatar || !nameEl || !userEl || !badge) return;

  const email = user.email?.toLowerCase() || "";
  const fallbackInitial = email ? email[0].toUpperCase() : "?";

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("display_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name || email.split("@")[0] || "User";
  const username = profile?.username || "user";
  const role = (profile?.role || "viewer").toLowerCase();

  document.body.dataset.role = role;

  avatar.textContent = displayName[0]?.toUpperCase() || fallbackInitial;
  nameEl.textContent = displayName;
  userEl.textContent = `@${username}`;

  badge.textContent = role;
  badge.className = `badge ${role}`;

  syncProfileUI(displayName, role);

  if (role === "artist" || role === "admin") {
    loadMyPendingArt();
  }

  const adminBtn = document.getElementById("adminPanelBtn");
  if (adminBtn && role === "admin") {
    adminBtn.style.display = "block";
  }
}

/* =========================
   PROFILE UI
   ========================= */

function syncProfileUI(displayName, role) {
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const artistActions = document.getElementById("artistActions");

  profileName && (profileName.textContent = displayName);
  profileRole && (profileRole.textContent = `${role} • NTSH`);

  if (artistActions && (role === "artist" || role === "admin")) {
    artistActions.style.display = "block";
  }
}

/* =========================
   UPLOAD MODAL
   ========================= */

function wireUploadModal() {
  const uploadBtn = document.getElementById("uploadBtn");
  const modal = document.getElementById("uploadModal");
  const cancelBtn = document.getElementById("cancelUpload");
  const submitBtn = document.getElementById("submitUpload");
  const fileInput = document.getElementById("fileInput");

  if (!uploadBtn || !modal) return;

  uploadBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    fileInput.value = "";
  });

  submitBtn?.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const title = document.getElementById("artTitle")?.value.trim() || null;
    const description =
      document.getElementById("artDescription")?.value.trim() || null;

    if (!file) {
      alert("Please select an image.");
      return;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabaseClient
      .storage
      .from("pending-art")
      .upload(filePath, file);

    if (uploadError) {
      alert("Upload failed.");
      return;
    }

    await supabaseClient.from("artworks").insert({
      owner_id: user.id,
      file_path: filePath,
      title,
      description,
      status: "pending"
    });

    modal.classList.add("hidden");
    fileInput.value = "";
    alert("Artwork submitted for review.");

    loadMyPendingArt();
  });
}

/* =========================
   PENDING ART (PROFILE)
   ========================= */

async function loadMyPendingArt() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

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
    const { data } = await supabaseClient
      .storage
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
