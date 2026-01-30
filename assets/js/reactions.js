// assets/js/reactions.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-react]");
  if (!buttons.length) return;

  const userId = sessionStorage.getItem("ntsh_uid");
  if (!userId) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const emoji = btn.dataset.react;
      const artworkId = btn.closest("[data-art-id]")?.dataset.artId;

      if (!artworkId) return;

      await window.supabase.from("reactions").insert({
        user_id: userId,
        item: artworkId,
        emoji
      });
    });
  });
});
