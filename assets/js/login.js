// assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = form.querySelector("input[type='email']");
  const password = form.querySelector("input[type='password']");
  const createBtn = document.querySelector(".btn.ghost");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await signIn(email.value, password.value);
  });

  createBtn.addEventListener("click", async () => {
    await signUp(email.value, password.value);
  });
});

async function signIn(email, password) {
  const { data, error } = await window.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "/home.html";
}

async function signUp(email, password) {
  const { data, error } = await window.supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await window.supabase.from("profiles").insert({
    id: data.user.id,
    email,
    role: "guest",
    approved: false
  });

  window.location.href = "/home.html";
}
