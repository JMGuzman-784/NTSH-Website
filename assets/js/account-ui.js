const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_PUBLIC_KEY_HERE";

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

async function hydrateAccount(user){
  const avatar = document.getElementById("accountAvatar");
  const nameEl = document.getElementById("accountName");
  const userEl = document.getElementById("accountUser");
  const badge = document.getElementById("roleBadge");

  // Default fallback
  const email = (user.email || "").toLowerCase();
  const fallbackInitial = email ? email[0].toUpperCase() : "?";

  // Pull profile
  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("display_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.warn("Profile fetch error:", error);

  const displayName = profile?.display_name || (email ? email.split("@")[0] : "User");
  const username = profile?.username || "user_000";
  const role = (profile?.role || "viewer").toLowerCase();

  avatar.textContent = (displayName?.[0] || fallbackInitial).toUpperCase();
  nameEl.textContent = displayName;
  userEl.textContent = `@${username}`;

  badge.textContent = role;
  badge.classList.remove("admin","artist");
  if (role === "admin") badge.classList.add("admin");
  if (role === "artist") badge.classList.add("artist");
}
