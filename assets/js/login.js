// assets/js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const signupBtn = document.getElementById("signupBtn");

  if (!form || !window.supabase) {
    console.error("Supabase not ready");
    return;
  }

  let mode = "login";

  signupBtn?.addEventListener("click", () => {
    mode = "signup";
    form.requestSubmit();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("input[type='email']").value.trim();
    const password = form.querySelector("input[type='password']").value;

    let result;

    if (mode === "signup") {
      result = await window.supabase.auth.signUp({ email, password });
    } else {
      result = await window.supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    sessionStorage.setItem("ntsh_uid", result.data.user.id);
    sessionStorage.setItem("ntsh_email", result.data.user.email);

    window.location.href = "/home.html";
  });
});
