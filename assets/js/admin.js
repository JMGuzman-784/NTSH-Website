const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";
// ===== ADMIN: REVIEW ONLY =====
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("pending-art");
  if (!container) return;

  const { data: artworks, error } = await supabaseClient
    .from("artworks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Error loading submissions.</p>";
    return;
  }

  if (!artworks || artworks.length === 0) {
    container.innerHTML = "<p>No pending submissions.</p>";
    return;
  }

  for (const art of artworks) {
    const { data } = await supabaseClient
      .storage
      .from("pending-art")
      .createSignedUrl(art.file_path, 3600);

    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img src="${data.signedUrl}">
      <strong>${art.title || "Untitled"}</strong>
      <p>${art.description || ""}</p>
      <button data-id="${art.id}" class="approve">Approve</button>
      <button data-id="${art.id}" class="reject">Reject</button>
    `;

    container.appendChild(card);
  }

  container.addEventListener("click", async (e) => {
    if (!e.target.dataset.id) return;

    const id = e.target.dataset.id;
    const status = e.target.classList.contains("approve")
      ? "approved"
      : "rejected";

    await supabaseClient
      .from("artworks")
      .update({ status })
      .eq("id", id);

    location.reload();
  });
});
