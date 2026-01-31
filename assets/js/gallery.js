// assets/js/gallery.js
import { getState } from "./state.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  const supabase = window.supabaseClient;
  if (!supabase) return;

  const { data, error } = await supabase
    .from("artworks")
    .select("id,title,file_path")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  grid.innerHTML = "";

  data.forEach(art => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `<strong>${art.title}</strong>`;
    grid.appendChild(card);
  });
});
