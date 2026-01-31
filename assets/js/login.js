// assets/js/login.js
// Clean split: Login vs Create Account (Supabase v2)

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  if (!window.supabase) {
    console.error("[LOGIN] Supabase not loaded");
    return;
  }

  // ===== LOGIN =====
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    console.log("[LOGIN] Attempt", email);

    const { data, error } =
      await window.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    await finalizeSession(data.user);
  });

  // ===== SIGN UP =====
  signupBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    console.log("[SIGNUP] Creating account", email);

    const { data, error } = await window.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. You can now log in.");
  });

  // ===== SESSION SETUP =====
  async function finalizeSession(user) {
    if (!user) {
      alert("Auth failed");
      return;
    }

    let role = "guest";
    let displayName = user.email.split("@")[0];

    // Admin override
    if (user.email === "ntshbusiness@gmail.com") {
      role = "admin";
      displayName = "Raid";
    }

    sessionStorage.clear();
    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_email", user.email);
    sessionStorage.setItem("ntsh_role", role);
    sessionStorage.setItem("ntsh_user", displayName);

    console.log("[LOGIN SUCCESS]", { role, displayName });

    window.location.href = "/home.html";
  }
});
