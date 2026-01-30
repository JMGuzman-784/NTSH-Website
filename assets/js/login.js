// assets/js/login.js
// Handles member login + signup only

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    console.log("[LOGIN] Attempt:", email);

    // 1️⃣ Try sign in
    let { data, error } = await window.supabase.auth.signInWithPassword({
      email,
      password
    });

    // 2️⃣ If user doesn't exist → sign up
    if (error && error.message.includes("Invalid login credentials")) {
      console.log("[LOGIN] Creating new account");

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
      alert("Login failed");
      return;
    }

    // 3️⃣ Resolve role
    const user = data.user;
    let role = "guest";
    let displayName = "guest_001";

    // 🔑 ADMIN OVERRIDE (YOU)
    if (user.email === "ntshbusiness@gmail.com") {
      role = "admin";
      displayName = "Raid";
    }

    // 4️⃣ Persist session identity
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_user", displayName);
    sessionStorage.setItem("ntsh_role", role);

    console.log("[LOGIN SUCCESS]", { role, displayName });

    // 5️⃣ Route
    if (role === "admin") {
      window.location.href = "/admin.html";
    } else {
      window.location.href = "/home.html";
    }
  });
});

