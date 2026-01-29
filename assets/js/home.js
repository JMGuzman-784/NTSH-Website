// /assets/js/home.js

document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const container = document.getElementById("home-gallery");
  if (!container) return;

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach(art => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <img src="${art.public_url}" />
      <div class="reaction-count">${art.reactions || 0}</div>
      <strong>${art.title}</strong>
    `;
    card.onclick = () => openArtModal(art);
    container.appendChild(card);
  });
});
let eggCount = 0;
const egg = document.getElementById("ntsh-easter-egg");

if (egg) {
  egg.onclick = () => {
    eggCount++;
    if (eggCount === 10) {
      document.body.classList.toggle("alt-theme");
      eggCount = 0;
    }
  };
}

