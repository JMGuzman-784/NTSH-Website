// gallery.js
import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
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

    card.innerHTML = `
      <img src="${art.file_path}" />
      <strong>${art.title}</strong>
    `;

    card.onclick = () => openArtModal(art);
    grid.appendChild(card);
  });
});
