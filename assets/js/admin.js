document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not found");
    return;
  }

  const supabase = window.supabaseClient;
  const container = document.getElementById("pending-art");

  if (!container) return;

  const { data: artworks, error } = await supabase
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
    const { data: signed } = await supabase.storage
      .from(art.bucket)
      .createSignedUrl(art.file_path, 3600);

    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img class="art-thumb" src="${signed.signedUrl}" />
      <strong>${art.title || "Untitled"}</strong>
      <p>${art.description || ""}</p>
      <div class="admin-actions">
        <button data-id="${art.id}" data-action="approved">Approve</button>
        <button data-id="${art.id}" data-action="rejected">Reject</button>
      </div>
    `;

    container.appendChild(card);
  }

  container.addEventListener("click", async (e) => {
    const btn = e.target;
    if (!btn.dataset.id) return;

    const { error } = await supabase
      .from("artworks")
      .update({ status: btn.dataset.action })
      .eq("id", btn.dataset.id);

    if (error) {
      console.error(error);
      alert("Update failed.");
      return;
    }

    location.reload();
  });
});
