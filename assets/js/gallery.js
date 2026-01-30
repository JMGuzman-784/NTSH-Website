// assets/js/gallery.js

document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("home-gallery");
  if (!gallery) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, bucket, file_path, title")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((art) => {
    const { data: urlData } = window.supabase
      .storage
      .from(art.bucket)
      .getPublicUrl(art.file_path);

    const img = document.createElement("img");
    img.src = urlData.publicUrl;
    img.alt = art.title || "Artwork";
    img.className = "gallery-img";

    gallery.appendChild(img);
  });
});
