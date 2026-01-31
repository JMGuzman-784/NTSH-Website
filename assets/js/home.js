import { supabase } from "./supabase-client.js";

const grid = document.querySelector(".grid");

const { data, error } = await supabase
  .from("artworks")
  .select("*")
  .eq("status", "approved")
  .order("created_at", { ascending: false });

if (!error && data) {
  grid.innerHTML = data.map(art => `
    <div class="art-card">
      <img src="${art.file_path}" />
      <p>${art.title}</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  if (role === "viewer") {
    const viewerId = getViewerId();
    sessionStorage.setItem("ntsh_user", viewerId);

    const badge = document.getElementById("userBadge");
    if (badge) badge.textContent = viewerId;
  }
});
