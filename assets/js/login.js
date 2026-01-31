// assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = form.querySelector("input[type='email']");
  const passwordInput = form.querySelector("input[type='password']");
  const createBtn = document.querySelector(".btn.ghost");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await login(emailInput.value, passwordInput.value);
  });

  createBtn.addEventListener("click", async () => {
    await signup(emailInput.value, passwordInput.value);
  });
});

async function login(email, password) {
  const { data, error } = await window.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await loadProfile(data.user.id);
  window.location.href = "/home.html";
}

async function signup(email, password) {
  const { data, error } = await window.supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await createProfile(data.user);
  window.location.href = "/home.html";
}

async function loadProfile(userId) {
  const { data } = await window.supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  window.setState({
    user: userId,
    profile: data,
    role: data?.role || "guest"
  });
}

async function createProfile(user) {
  await window.supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    role: "guest",
    approved: false
  });
}
