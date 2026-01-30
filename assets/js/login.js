// /assets/js/login.js
// Handles member login & signup only

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = form.querySelector("input[type='email']");
  const passwordInput = form.querySelector("input[type='password']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email and password required.");
      return;
    }

    const supabase = window.supabaseClient;

    // Try sign-in
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // If user not found → create account
    if (error && error.message.includes("Invalid login credentials")) {
      const signup = await supabase.auth.signUp({
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
      alert("Login failed.");
      return;
    }

    const user = data.user;

    // Default role
    let role = "guest";
    let displayName = "guest";

    // ADMIN OVERRIDE (YOU)
    if (email === "ntshbusiness@gmail.com") {
      role = "admin";
      displayName = "Raid";
    }

    // Persist identity
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_role", role);
    sessionStorage.setItem("ntsh_user", displayName);

    // Route everyone to home
    window.location.href = "/home.html";
  });
});
