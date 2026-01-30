// assets/js/login.js
// Handles login + signup ONLY

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

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

    // If user doesn't exist → sign up
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

    // Role resolution
    let role = "guest";
    let displayName = email;

    if (user.email === "ntshbusiness@gmail.com") {
      role = "admin";
      displayName = "Raid";
    }

    sessionStorage.clear();
    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_role", role);
    sessionStorage.setItem("ntsh_user", displayName);

    console.log("[LOGIN SUCCESS]", { role, displayName });

    // ALWAYS go to home
    window.location.href = "/home.html";
  });
});
