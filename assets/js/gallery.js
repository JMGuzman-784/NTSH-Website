// assets/js/gallery.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase not loaded");
    return;
  }

  const { data, error } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  data.forEach(art => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <img src="${art.file_path}" alt="${art.title}" />
      <h4>${art.title}</h4>
    `;
    gallery.appendChild(card);
  });
});
