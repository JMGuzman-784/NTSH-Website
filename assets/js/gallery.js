// assets/js/gallery.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("[Gallery] Supabase not available");
    return;
  }

  const container = document.getElementById("gallery");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, file_path")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Gallery]", error);
    return;
  }

  container.innerHTML = "";

  data.forEach((art) => {
    const img = document.createElement("img");
    img.src = window.supabase.storage
      .from("artworks")
      .getPublicUrl(art.file_path).data.publicUrl;

    img.alt = art.title;
    img.className = "gallery-item";

    container.appendChild(img);
  });
});
