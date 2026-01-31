// assets/js/gallery.js
// Loads approved artwork only

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("gallery");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data.length) {
    container.innerHTML = "<p>No artwork yet</p>";
    return;
  }

  data.forEach(art => {
    const img = document.createElement("img");
    img.className = "gallery-img";
    img.src = window.supabase.storage
      .from("artworks")
      .getPublicUrl(art.file_path).data.publicUrl;

    img.alt = art.title;
    container.appendChild(img);
  });
});
