// ========= CONFIG =========
const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";
const HOME_URL = "/home.html";

// ========= UI WIRING FIRST (ALWAYS) =========
document.addEventListener("DOMContentLoaded", () => {
  wireUI();           // <-- buttons will work no matter what
  initSupabase();     // <-- auth only if configured
});

function wireUI(){
  const modal = document.getElementById("modal");
  const toast = document.getElementById("toast");

  const openLogin = document.getElementById("openLogin");
  const openSignup = document.getElementById("openSignup");
  const closeModal = document.getElementById("closeModal");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const toSignup = document.getElementById("toSignup");
  const toLogin = document.getElementById("toLogin");

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // expose for initSupabase
  window.__NTSH_TOAST__ = showToast;

  const open = (mode) => {
    modal.setAttribute("aria-hidden", "false");
    if (mode === "login"){
      document.getElementById("modalTitle").textContent = "Log In";
      loginForm.hidden = false;
      signupForm.hidden = true;
    } else {
      document.getElementById("modalTitle").textContent = "Sign Up";
      loginForm.hidden = true;
      signupForm.hidden = false;
    }
  };

  const close = () => modal.setAttribute("aria-hidden", "true");

  openLogin?.addEventListener("click", () => open("login"));
  openSignup?.addEventListener("click", () => open("signup"));
  closeModal?.addEventListener("click", close);

  toSignup?.addEventListener("click", () => open("signup"));
  toLogin?.addEventListener("click", () => open("login"));

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // If Supabase isn’t configured yet, prevent form submit from doing nothing
  loginForm?.addEventListener("submit", (e) => {
    if (!window.__SUPABASE_READY__) {
      e.preventDefault();
      showToast("Auth not connected yet. Add Supabase keys in auth-gate.js.");
    }
  });

  signupForm?.addEventListener("submit", (e) => {
    if (!window.__SUPABASE_READY__) {
      e.preventDefault();
      showToast("Auth not connected yet. Add Supabase keys in auth-gate.js.");
    }
  });
}

// ========= SUPABASE INIT + AUTH =========
let supabaseClient = null;

async function initSupabase(){
  const toast = window.__NTSH_TOAST__ || (()=>{});

  // Let UI work even if this fails
  if (!window.supabase) {
    toast("Supabase SDK not loaded (CDN). UI is fine, auth disabled.");
    return;
  }

  // If user hasn’t pasted keys yet, don’t crash
  if (!SUPABASE_URL.startsWith("https://") || SUPABASE_ANON_KEY.includes("PASTE_")) {
    toast("Supabase keys not pasted yet. UI is fine, auth disabled.");
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.__SUPABASE_READY__ = true;

  // If already logged in -> go home
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) window.location.href = HOME_URL;

  // Now attach real submit handlers
  attachAuthHandlers();
}

function attachAuthHandlers(){
  const toast = window.__NTSH_TOAST__ || (()=>{});

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identityRaw = document.getElementById("loginIdentity").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!identityRaw || !password) return toast("Fill in all fields.");

    let emailToUse = identityRaw;

    // username -> email lookup
    if (!identityRaw.includes("@")) {
      const username = identityRaw.toLowerCase();
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("username", username)
        .maybeSingle();

      if (error) return toast("Login failed. Try again.");
      if (!data?.email) return toast("Username not found.");
      emailToUse = data.email;
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: emailToUse,
      password
    });

    if (signInError) return toast(signInError.message);

    toast("Signed in.");
    window.location.href = HOME_URL;
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirm) {
      return toast("Fill in all fields.");
    }
    if (password.length < 8 || password.length > 10) {
      return toast("Password must be 8–10 characters.");
    }
    if (password !== confirm) {
      return toast("Passwords do not match.");
    }

    const { data, error: signUpError } = await supabaseClient.auth.signUp({ email, password });
    if (signUpError) return toast(signUpError.message);
    if (!data.user) return toast("Signup failed. Try again.");

    const base = (firstName[0] + lastName[0]).toLowerCase();
    const username = await generateUsername(base);

    const { error: profileError } = await supabaseClient.from("profiles").insert({
      id: data.user.id,
      role: "viewer",
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      display_name: `${firstName} ${lastName}`
    });

    if (profileError) {
      console.error(profileError);
      return toast("Account created, but profile setup failed (check RLS/policies).");
    }

    toast(`Account created. Username: ${username}`);
    window.location.href = HOME_URL;
  });

  async function generateUsername(base){
    for (let i = 1; i < 1000; i++){
      const suffix = String(i).padStart(3, "0");
      const candidate = `${base}_${suffix}`;

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("username", candidate)
        .maybeSingle();

      if (error) return candidate;
      if (!data) return candidate;
    }
    return `${base}_${Date.now().toString().slice(-3)}`;
  }
}
