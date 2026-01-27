const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";


// If true: users must be logged in to use /home.html
const REQUIRE_LOGIN_ON_HOME = true;

let supabaseClient = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase SDK not loaded.");
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  wireMenu();

  // session check
  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    if (REQUIRE_LOGIN_ON_HOME) window.location.href = "/";
    return;
  }

  await hydrateAccount(user);

  // keep UI in sync
  supabaseClient.auth.onAuthStateChange(async (_evt, session) => {
    if (!session?.user) {
      if (REQUIRE_LOGIN_ON_HOME) window.location.href = "/";
      return;
    }
    await hydrateAccount(session.user);
  });
});

function wireMenu(){
  const btn = document.getElementById("accountBtn");
  const menu = document.getElementById("accountMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  const toggle = () => {
    const isOpen = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  };

  btn?.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  document.addEventListener("click", (e) => {
    if (!menu || !btn) return;
    const inside = menu.contains(e.target) || btn.contains(e.target);
    if (!inside && menu.classList.contains("open")) {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });

  settingsBtn?.addEventListener("click", () => {
    alert("Settings coming soon.");
  });

  logoutBtn?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "/";
  });
}
async function loadMyPendingArt() {
  ...
}

async function hydrateAccount(user){
  
  const avatar = document.getElementById("accountAvatar");
  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const badge = document.getElementById("roleBadge");

  const email = (user.email || "").toLowerCase();
  const fallbackInitial = email ? email[0].toUpperCase() : "?";

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("display_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.warn("Profile fetch error:", error);

  const displayName = profile?.display_name || (email ? email.split("@")[0] : "User");
  const username = profile?.username || "user_000";
  const role = (profile?.role || "viewer").toLowerCase();

  // 🔑 SET ROLE GLOBALLY
  document.body.dataset.role = role;
 console.log("ROLE:", role, "artistActions:", document.getElementById("artistActions"));


  avatar.textContent = (displayName?.[0] || fallbackInitial).toUpperCase();
  nameEl.textContent = displayName;
  userEl.textContent = `@${username}`;

  badge.textContent = role;
  badge.classList.remove("admin","artist");
  if (role === "admin") badge.classList.add("admin");
  if (role === "artist") badge.classList.add("artist");

  // ---- Profile page UI sync ----
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const artistActions = document.getElementById("artistActions");

  if (profileName) profileName.textContent = displayName;
  if (profileRole) profileRole.textContent = `${role} • NTSH`;

  if (artistActions && (role === "artist" || role === "admin")) {
    artistActions.style.display = "block";
  }

  // Socials (temporary hardcode)
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
  loadMyPendingArt();

}


// ---- Settings modal logic ----
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settingsBtn");
  const modal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const saveBtn = document.getElementById("saveSettingsBtn");

  const nameInput = document.getElementById("settingsDisplayName");
  const userInput = document.getElementById("settingsUsername");

  if (!settingsBtn || !modal) return;

  settingsBtn.addEventListener("click", async () => {
    modal.classList.remove("hidden");

    // Pre-fill with current values
    nameInput.value = document.getElementById("accountName")?.textContent || "";
    userInput.value = document.getElementById("accountUser")?.textContent.replace("@","") || "";
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  saveBtn.addEventListener("click", async () => {
    const display_name = nameInput.value.trim();
    const username = userInput.value.trim().toLowerCase();

    if (!display_name || !username) {
      alert("Both fields are required.");
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .update({ display_name, username })
      .eq("id", (await supabaseClient.auth.getUser()).data.user.id);

    if (error) {
      alert("Username may already be taken.");
      console.error(error);
      return;
    }

    // Update UI immediately
    document.getElementById("accountName").textContent = display_name;
    document.getElementById("accountUser").textContent = `@${username}`;
    document.getElementById("accountAvatar").textContent = display_name[0].toUpperCase();

    modal.classList.add("hidden");
  });
});
// ---- Upload Art (V1) ----
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");

  if (!uploadBtn || !fileInput) return;

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    // 1️⃣ Upload to pending-art bucket
    const { error: uploadError } = await supabaseClient
      .storage
      .from("pending-art")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed.");
      return;
    }

    // 2️⃣ Insert metadata row
    const { error: dbError } = await supabaseClient
      .from("artworks")
      .insert({
        owner_id: user.id,
        bucket: "pending-art",
        file_path: filePath
      });

    if (dbError) {
      console.error(dbError);
      alert("Database insert failed.");
      return;
    }

    alert("Upload successful! Pending approval.");
    fileInput.value = "";
  });
});
// ---- Load My Pending Art (Profile) ----
async function loadMyPendingArt() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const { data: artworks, error } = await supabaseClient
    .from("artworks")
    .select("id, file_path")
    .eq("owner_id", user.id)
    .eq("bucket", "pending-art")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load art error:", error);
    return;
  }

  for (const art of artworks) {
    const { data: signed, error: urlErr } = await supabaseClient
      .storage
      .from("pending-art")
      .createSignedUrl(art.file_path, 60 * 60);

    if (urlErr) continue;

    const img = document.createElement("img");
    img.src = signed.signedUrl;
    img.style.width = "100%";
    img.style.aspectRatio = "1 / 1";
    img.style.objectFit = "cover";
    img.style.borderRadius = "10px";

    grid.appendChild(img);
  }
}
