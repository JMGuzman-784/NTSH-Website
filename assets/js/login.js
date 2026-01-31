// assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    console.log("[LOGIN] Attempt:", email);

    // Try sign in
    let { data, error } = await window.supabase.auth.signInWithPassword({
      email,
      password
    });

    // If user not found → sign up
    if (error && error.message.includes("Invalid login credentials")) {
      console.log("[LOGIN] Creating account");

      const signup = await window.supabase.auth.signUp({
        email,
        password
      });

      if (signup.error) {
        alert(signup.error.message);
        return;
      }

      data = signup.data;
    }

    if (!data?.user) {
      alert("Authentication failed");
      return;
    }

    const user = data.user;

    // Admin override
    let role = "guest";
    let displayName = email;

    if (email === "ntshbusiness@gmail.com") {
      role = "admin";
      displayName = "Raid";
    }

    sessionStorage.clear();
    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_role", role);
    sessionStorage.setItem("ntsh_user", displayName);

    console.log("[LOGIN SUCCESS]", { role, displayName });

    window.location.href = "/home.html";
  });
});
