const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";

/* =========================
   CONFIG
   ========================= */

const REQUIRE_LOGIN_ON_HOME = false;
let supabaseClient = null;


/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase SDK not loaded.");
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  wireMenu();

  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    const path = window.location.pathname;
    if (path.includes("home.html") || path.includes("profile.html")) {
      window.location.href = "/";
    }
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

  const email = user.email?.toLowerCase() || "";
  const fallbackInitial = email ? email[0].toUpperCase() : "?";

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("display_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.warn("Profile fetch error:", error);

  const displayName = profile?.display_name || email.split("@")[0] || "User";
  const username = profile?.username || "user_000";
  const role = (profile?.role || "viewer").toLowerCase();

  document.body.dataset.role = role;

  avatar.textContent = displayName[0]?.toUpperCase() || fallbackInitial;
  nameEl.textContent = displayName;
  userEl.textContent = `@${username}`;

  badge.textContent = role;
  badge.classList.toggle("artist", role === "artist");
  badge.classList.toggle("admin", role === "admin");

  syncProfileUI(displayName, role, username);

  if (role === "artist" || role === "admin") {
    loadMyPendingArt();
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

  if (artistActions && (role === "artist" || role === "admin")) {
    artistActions.style.display = "block";
  }

  // Temporary hardcoded socials
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
   SETTINGS MODAL
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const saveBtn = document.getElementById("saveSettingsBtn");

  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });

  saveBtn?.addEventListener("click", async () => {
    const nameInput = document.getElementById("settingsDisplayName");
    const userInput = document.getElementById("settingsUsername");

    const display_name = nameInput.value.trim();
    const username = userInput.value.trim().toLowerCase();

    if (!display_name || !username) {
      alert("Both fields are required.");
      return;
    }

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    const { error } = await supabaseClient
      .from("profiles")
      .update({ display_name, username })
      .eq("id", user.id);

    if (error) {
      alert("Username may already be taken.");
      return;
    }

    modal.classList.add("hidden");
    hydrateAccount(user);
  });
});


/* =========================
   UPLOAD ART (ARTISTS ONLY)
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");

  if (!uploadBtn || !fileInput) return;

  uploadBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

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
      status: "pending"
    });

    alert("Upload successful! Pending approval.");
    fileInput.value = "";
    loadMyPendingArt();
  });
});


/* =========================
   PENDING ART (PROFILE)
   ========================= */

async function loadMyPendingArt() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

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
    const { data } = supabaseClient
      .storage
      .from("pending-art")
      .getPublicUrl(art.file_path);

    const card = document.createElement("div");
    card.className = "art-card";

    const img = document.createElement("img");
    img.src = data.publicUrl;

    card.appendChild(img);
    grid.appendChild(card);
  }
}


/* =========================
   APPROVAL (RAID / ADMIN)
   ========================= */

async function approveArtwork(artworkId) {
  await supabaseClient
    .from("artworks")
    .update({
      status: "approved",
      approved_at: new Date().toISOString()
    })
    .eq("id", artworkId);

  loadMyPendingArt();
}
