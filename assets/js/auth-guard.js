// auth-guard.js
import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // Viewer-only pages allowed
  if (!user && page === "home") return;

  // No session → redirect
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

// assets/js/auth-guard.js

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  console.log("[AUTH]", role);

  if (!role) {
    window.location.href = "/index.html";
    return;
  }

  // Viewer is allowed on home
  if (role === "viewer") return;

  // Guests, artists, admin allowed
});


  
  const role = user.user_metadata?.role || "guest";

  // Admin gate
  if (page === "admin" && role !== "admin") {
    alert("Admins only.");
    window.location.href = "/home.html";
  }
});
