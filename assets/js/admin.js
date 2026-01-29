(() => {
  if (window.__ADMIN_LOADED__) return;
  window.__ADMIN_LOADED__ = true;

  document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) {
      console.error("Supabase client not available");
      return;
    }

    const supabase = window.supabaseClient;
    const container = document.getElementById("pending-art");
    if (!container) return;

    container.innerHTML = "";

    try {
      const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!artworks || artworks.length === 0) {
        container.innerHTML = "<p>No pending submissions.</p>";
        return;
      }

      for (const art of artworks) {
        const { data: signed } = await supabase
          .storage
          .from("pending-art")
          .createSignedUrl(art.file_path, 3600);

        const card = document.createElement("div");
        card.className = "art-card";

        card.innerHTML = `
          <img class="art-thumb" src="${signed.signedUrl}" />
          <strong>${art.title || "Untitled"}</strong>
          <p>${art.description || ""}</p>
          <div class="admin-actions">
            <button data-id="${art.id}" data-action="approve">Approve</button>
            <button data-id="${art.id}" data-action="reject">Reject</button>
          </div>
        `;

        container.appendChild(card);
      }

      container.addEventListener("click", async (e) => {
        const btn = e.target;
        if (!btn.dataset?.id) return;

        const status =
          btn.dataset.action === "approve" ? "approved" : "rejected";

        await supabase
          .from("artworks")
          .update({ status })
          .eq("id", btn.dataset.id);

        location.reload();
      });

    } catch (err) {
      console.error("Admin load failed:", err);
      container.innerHTML = "<p>Unexpected error.</p>";
    }
  });
  // /assets/js/admin.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPending() {
  const { data } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending");

  data.forEach(art => {
    // render approve / deny buttons
  });
}

loadPending();

})();
