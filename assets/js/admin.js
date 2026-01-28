document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not available");
    return;
  }

  const supabaseClient = window.supabaseClient;


const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not available");
    return;
  }

  const supabaseClient = window.supabaseClient;
  const container = document.getElementById("pending-art");

  if (!container) return;

  const { data: artworks, error } = await supabaseClient
    .from("artworks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
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
      <img src="${data.signedUrl}" />
      <strong>${art.title || "Untitled"}</strong>
      <p>${art.description || ""}</p>
      <button data-id="${art.id}" data-action="approve">Approve</button>
      <button data-id="${art.id}" data-action="reject">Reject</button>
    `;

    container.appendChild(card);
  }

  container.addEventListener("click", async (e) => {
    const btn = e.target;
    if (!btn.dataset.id) return;

    const newStatus =
      btn.dataset.action === "approve" ? "approved" : "rejected";

    await supabaseClient
      .from("artworks")
      .update({ status: newStatus })
      .eq("id", btn.dataset.id);

    location.reload();
  });
});
