// /assets/js/login.js
import { routeAfterLogin } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const signupBtn = document.getElementById("signupBtn");

  if (!form) return;

  let mode = "login"; // default

  signupBtn?.addEventListener("click", () => {
    mode = "signup";
    form.requestSubmit();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("input[type='email']").value.trim();
    const password = form.querySelector("input[type='password']").value;

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    const supabase = window.supabase;
    let result;

    if (mode === "signup") {
      // 🆕 Explicit signup
      result = await supabase.auth.signUp({ email, password });
    } else {
      // 🔐 Login
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    if (!result.data?.user) {
      alert("Authentication failed");
      return;
    }

    routeAfterLogin(result.data.user);
  });
});
