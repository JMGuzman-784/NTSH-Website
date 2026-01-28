(() => {
  if (window.__HOME_LOADED__) return;
  window.__HOME_LOADED__ = true;

  document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) return;

    const supabase = window.supabaseClient;
    const track = document.getElementById("home-gallery");
    const dotsWrap = document.getElementById("gallery-dots");

    if (!track) return;

    const { data: artworks } = await supabase
      .from("artworks")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!artworks || artworks.length === 0) {
      track.innerHTML = "<p style='opacity:.6'>No approved art yet.</p>";
      return;
    }

    track.innerHTML = "";
    dotsWrap.innerHTML = "";

    artworks.forEach(async (art, index) => {
      const { data } = await supabase
        .storage
        .from("pending-art")
        .createSignedUrl(art.file_path, 3600);

      if (!data?.signedUrl) return;

      // CARD
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.innerHTML = `<img src="${data.signedUrl}" alt="${art.title || ""}" />`;
      track.appendChild(card);

      // DOT
      const dot = document.createElement("span");
      dot.className = "dot";
      if (index === 0) dot.classList.add("active");

      dot.onclick = () => {
        track.scrollTo({
          left: card.offsetLeft,
          behavior: "smooth"
        });
      };

      dotsWrap.appendChild(dot);
    });

    // Sync dots on scroll
    track.addEventListener("scroll", () => {
      const cards = [...track.children];
      const dots = [...dotsWrap.children];

      const index = cards.findIndex(
        c => c.offsetLeft >= track.scrollLeft - 10
      );

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    });
  });
})();
