// assets/js/login.js
import { supabase } from "./supabase-client.js";

const form = document.getElementById("loginForm");
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const createBtn = document.getElementById("createAccountBtn");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  routeAfterLogin(data.user);
});

createBtn?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  routeAfterLogin(data.user);
});

function routeAfterLogin(user) {
  sessionStorage.setItem("uid", user.id);
  sessionStorage.setItem("email", user.email);

  if (user.email === "ntshbusiness@gmail.com") {
    sessionStorage.setItem("role", "admin");
  } else {
    sessionStorage.setItem("role", "guest");
  }

  window.location.href = "/home.html";
}
