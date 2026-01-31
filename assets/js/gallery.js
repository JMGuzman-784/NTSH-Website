// assets/js/gallery.js

document.addEventListener("DOMContentLoaded", loadGallery);

async function loadGallery() {
  if (!window.supabase) return;

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, bucket, file_path")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gallery error:", error);
    return;
  }

  gallery.innerHTML = "";

  data.forEach((art) => {
    const url = window.supabase
      .storage
      .from(art.bucket)
      .getPublicUrl(art.file_path).data.publicUrl;

    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <img src="${url}" />
      <div class="art-overlay">
        <strong>${art.title}</strong>
      </div>
    `;

    card.onclick = () => openArtModal(art, url);
    gallery.appendChild(card);
  });
}
