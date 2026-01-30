// /assets/js/home.js
// Loads approved art (display only)

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  if (page !== "home") return;

  const grid = document.querySelector(".grid");
  if (!grid) return;

  const supabase = window.supabaseClient;

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
    card.onclick = () => openArtModal(art);

    grid.appendChild(card);
  });
});
