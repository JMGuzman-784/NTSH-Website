document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not available");
    return;
  }
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not available");
    return;
  }

  const supabaseClient = window.supabaseClient;
  const container = document.getElementById("pending-art");

  if (!container) {
    console.warn("pending-art container not found");
    return;
  }

  try {
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

  try {
    await supabaseClient
      .from("artworks")
      .update({ status: newStatus })
      .eq("id", btn.dataset.id);

    location.reload();
  } catch (err) {
    console.error("Admin load failed:", err);
    container.innerHTML = "<p>Unexpected error.</p>";
  }
});
