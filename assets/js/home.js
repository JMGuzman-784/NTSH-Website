// /assets/js/home.js
// Home page: approved art + viewer-safe interactions

document.addEventListener("ntsh:auth-ready", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const { role, uid } = window.NTSH;

  const gallery = document.getElementById("home-gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  // Load approved artwork
  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load approved art:", error);
    return;
  }

  if (!artworks || artworks.length === 0) {
    gallery.innerHTML = `<p style="opacity:.6;">No approved artwork yet.</p>`;
    return;
  }

  for (const art of artworks) {
    // Generate image URL from storage
    let imageUrl = art.public_url;

    if (!imageUrl && art.file_path) {
      const { data } = await supabase.storage
        .from("approved-art")
        .createSignedUrl(art.file_path, 3600);

      imageUrl = data?.signedUrl || "";
    }

    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img src="${imageUrl}" alt="${art.title || "Artwork"}" />
      <div class="reaction-count" data-art="${art.id}">0</div>
      <strong>${art.title || "Untitled"}</strong>
    `;

    card.addEventListener("click", () => {
      if (typeof openArtModal === "function") {
        openArtModal(art);
      }
    });

    gallery.appendChild(card);

    // Load reaction count
    loadReactionCount(art.id);
  }

  setupEasterEgg();
});

/* =========================
   REACTIONS (read-only here)
   ========================= */

async function loadReactionCount(artId) {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const counter = document.querySelector(
    `.reaction-count[data-art="${artId}"]`
  );

  const { count } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("artwork_id", artId);

  if (counter) counter.textContent = count || 0;
}

/* =========================
   EASTER EGG (10 clicks)
   ========================= */

function setupEasterEgg() {
  const egg = document.getElementById("easterEgg");
  if (!egg) return;

  let count = 0;

  egg.addEventListener("click", () => {
    count++;
    if (count >= 10) {
      document.body.classList.toggle("alt-theme");
      count = 0;
    }
  });
}
