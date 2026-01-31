// assets/js/auth-guard.js
// Controls access to pages (NO UI, NO SUPABASE)

import { loadState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = loadState();
  const path = window.location.pathname;

  console.log("[AUTH GUARD]", { path, state });

  // Public pages
  if (path === "/" || path.includes("index.html") || path.includes("login.html")) {
    return;
  }

  // If no session → kick to index
  if (!state.uid || !state.role) {
    console.warn("[AUTH GUARD] No session, redirecting");
    window.location.href = "/index.html";
    return;
  }

  // Admin page protection
  if (path.includes("admin.html") && state.role !== "admin") {
    console.warn("[AUTH GUARD] Admin only");
    window.location.href = "/home.html";
    return;
  }
});
