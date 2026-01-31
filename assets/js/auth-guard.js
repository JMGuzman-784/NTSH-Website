// assets/js/auth-guard.js
import { getState, clearState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = getState();

  // If no state at all → send to index
  if (!state) {
    window.location.href = "/index.html";
    return;
  }

  const page = document.body.dataset.page;

  // Viewer cannot access admin
  if (page === "admin" && state.role !== "admin") {
    alert("Admins only.");
    window.location.href = "/index.html";
  }
});
