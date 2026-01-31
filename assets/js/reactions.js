// assets/js/reactions.js

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");
  const uid = sessionStorage.getItem("ntsh_uid");

  if (!uid || role === "viewer") return;

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-emoji]");
    if (!btn) return;

    const artworkId = btn.closest("[data-art-id]")?.dataset.artId;
    if (!artworkId) return;

    const emoji = btn.dataset.emoji;

    const { error } = await window.supabase.from("reactions").insert({
      item: artworkId,
      user_id: uid,
      emoji
    });

    if (error && !error.message.includes("duplicate")) {
      console.error(error);
    }
  });
});
