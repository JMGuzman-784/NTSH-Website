// /assets/js/modal.js
let currentArtworkId = null;

window.openArtModal = (art) => {
  currentArtworkId = art.id;

  document.getElementById("modalImage").src = art.image_url;
  document.getElementById("modalTitle").textContent = art.title || "Untitled";

  document.getElementById("artModal").classList.remove("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("artModal");
  if (!modal) return;

  document.getElementById("closeModal").onclick = () => {
    modal.classList.add("hidden");
  };

  modal.querySelectorAll("[data-emoji]").forEach(btn => {
    btn.onclick = async () => {
      const role = window.NTSH_STATE.role;
      if (role === "viewer") {
        alert("Members only.");
        return;
      }

      const supabase = window.supabaseClient;
      await supabase.from("reactions").insert({
        artwork_id: currentArtworkId,
        user_id: sessionStorage.getItem("ntsh_uid"),
        emoji: btn.dataset.emoji
      });
    };
  });
});
