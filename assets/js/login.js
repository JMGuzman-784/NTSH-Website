// /assets/js/login.js
import { routeAfterLogin } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("input[type='email']").value.trim();
    const password = form.querySelector("input[type='password']").value;

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    const supabase = window.supabase;

    // 1️⃣ Try login
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // 2️⃣ If not found → sign up
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
      alert("Login failed");
      return;
    }

    routeAfterLogin(data.user);
  });
});
