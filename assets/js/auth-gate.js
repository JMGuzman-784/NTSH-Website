// ========= CONFIG =========
const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_PUBLIC_KEY_HERE";

// Where your app lives after login
const HOME_URL = "/home.html";

// ========= INIT =========
let supabaseClient = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase SDK not loaded.");
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // If already logged in -> go home
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) window.location.href = HOME_URL;

  wireUI();
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

  openLogin.addEventListener("click", () => open("login"));
  openSignup.addEventListener("click", () => open("signup"));
  closeModal.addEventListener("click", close);

  toSignup.addEventListener("click", () => open("signup"));
  toLogin.addEventListener("click", () => open("login"));

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // ========= LOGIN =========
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identityRaw = document.getElementById("loginIdentity").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!identityRaw || !password) return showToast("Fill in all fields.");

    // If user typed username, convert to email via profiles table
    let emailToUse = identityRaw;

    if (!identityRaw.includes("@")) {
      const username = identityRaw.toLowerCase();
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("username", username)
        .maybeSingle();

      if (error) return showToast("Login failed. Try again.");
      if (!data?.email) return showToast("Username not found.");

      emailToUse = data.email;
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: emailToUse,
      password
    });

    if (signInError) return showToast(signInError.message);

    showToast("Signed in.");
    window.location.href = HOME_URL;
  });

  // ========= SIGNUP =========
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirm) {
      return showToast("Fill in all fields.");
    }

    if (password.length < 8 || password.length > 10) {
      return showToast("Password must be 8–10 characters.");
    }

    if (password !== confirm) {
      return showToast("Passwords do not match.");
    }

    // Create account in Supabase Auth
    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (signUpError) return showToast(signUpError.message);
    if (!data.user) return showToast("Signup failed. Try again.");

    // Generate username: f + l + _001 ...
    const base = (firstName[0] + lastName[0]).toLowerCase();
    const username = await generateUsername(base);

    // Insert profile row
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
      // If profile insert fails, account still exists. Notify and you can fix it in dashboard.
      console.error(profileError);
      return showToast("Account created, but profile setup failed.");
    }

    showToast(`Account created. Username: ${username}`);

    // After signup: if email confirmations are ON, user may need to confirm first.
    // We'll still route them to home; home can handle "not fully confirmed" state later.
    window.location.href = HOME_URL;
  });

  // ========= Username helper =========
  async function generateUsername(base){
    // base is like "jg"
    for (let i = 1; i < 1000; i++){
      const suffix = String(i).padStart(3, "0");
      const candidate = `${base}_${suffix}`;

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("username", candidate)
        .maybeSingle();

      if (error) {
        // If the query fails, bail out with the first candidate
        return candidate;
      }

      if (!data) return candidate; // not taken
    }
    // fallback
    return `${base}_${Date.now().toString().slice(-3)}`;
  }
}
