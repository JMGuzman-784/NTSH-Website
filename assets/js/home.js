// assets/js/home.js
import { getViewerId } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  if (role === "viewer") {
    const viewerId = getViewerId();
    sessionStorage.setItem("ntsh_user", viewerId);

    const badge = document.getElementById("userBadge");
    if (badge) badge.textContent = viewerId;
  }
});
