// ---- Supabase init (fill these in) ----
const SUPABASE_URL = "https://YOUR-PROJECT-ref.supabase.co";
const SUPABASE_ANON_KEY = "ey...your_anon_key...";

let supabaseClient = null;
window.addEventListener("DOMContentLoaded", () => {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    wireAuthUI();
  } else {
    console.warn("Supabase SDK not loaded.");
  }
});

// ---- UI elements ----
const authBtn   = document.getElementById("authBtn");
const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");
const modal     = document.getElementById("authModal");
const toastEl   = document.getElementById("toast");
const authForm  = document.getElementById("authForm");
const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");
const closeAuth = document.getElementById("closeAuth");
const reactions = document.getElementById("reactions");

// state
let currentUser = null;
let currentRole = "viewer";

// ---- helpers ----
function showToast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(()=> toastEl.classList.remove("show"), 2600);
}
function openModal(){ modal?.setAttribute("aria-hidden", "false"); }
function closeModal(){ modal?.setAttribute("aria-hidden", "true"); }

// ---- auth wiring ----
function wireAuthUI(){
  authBtn?.addEventListener("click", openModal);
  closeAuth?.addEventListener("click", closeModal);

  // sign in
  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return showToast(error.message);
    showToast("Signed in.");
    closeModal();
  });

  // sign up
  signUpBtn?.addEventListener("click", async () => {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return showToast(error.message);
    // create profile row with default role viewer
    if (data.user) {
      await supabaseClient.from("profiles").insert({ id: data.user.id, role: "viewer", display_name: email.split("@")[0] }).catch(()=>{});
      showToast("Account created. Check your email (if confirmation is on).");
      closeModal();
    }
  });

  // sign out
  logoutBtn?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    showToast("Signed out.");
  });

  // on auth state change, refresh UI
  supabaseClient.auth.onAuthStateChange(async (_evt, session) => {
    currentUser = session?.user || null;
    await refreshRole();
    refreshButtons();
  });

  // first load
  supabaseClient.auth.getSession().then(async ({ data }) => {
    currentUser = data.session?.user || null;
    await refreshRole();
    refreshButtons();
  });

  // reactions
  reactions?.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const emoji = btn.dataset.emoji;
      if(!currentUser){
        showToast("Log in to react.");
        openModal();
        return;
      }
      const img = document.getElementById("display");
      // derive category/item from img src (works with your current setup)
      const src = img?.getAttribute("src") || "";
      // expected: assets/images/<category>/<file>
      const parts = src.split("/");
      const category = parts[2] || "unknown";
      const file = parts[3] || "unknown";
      const { error } = await supabaseClient.from("reactions").insert({
        user_id: currentUser.id,
        category,
        item: file,
        emoji
      });
      if(error){
        // unique constraint -> already reacted with this emoji
        if (error.code === "23505") return showToast("You already reacted.");
        return showToast(error.message);
      }
      showToast("Reaction added ✨");
    });
  });
}

async function refreshRole(){
  if(!currentUser){ currentRole = "viewer"; return; }
  const { data } = await supabaseClient.from("profiles").select("role").eq("id", currentUser.id).maybeSingle();
  currentRole = data?.role || "viewer";
}

function refreshButtons(){
  const signedIn = !!currentUser;
  authBtn.hidden   = signedIn;
  logoutBtn.hidden = !signedIn;

  // artists/admin can upload → enable
  const canUpload = (currentRole === "artist" || currentRole === "admin");
  uploadBtn.disabled = !canUpload;
  uploadBtn.title    = canUpload ? "Open Studio (coming soon)" : "Artists only";
  if (canUpload) {
    uploadBtn.onclick = () => {
      showToast("Studio coming soon. You have upload access.");
      // later: window.location.href = "/studio.html";
    };
  } else {
    uploadBtn.onclick = () => showToast("Request verification to upload.");
  }
}
