// assets/js/reactions.js

document.addEventListener("click", async (e) => {
  if (!e.target.dataset.emoji) return;

  const modal = document.getElementById("artModal");
  const artId = modal.dataset.artId;
  const uid = sessionStorage.getItem("ntsh_uid");

  if (!artId || !uid) return;

  const emoji = e.target.dataset.emoji;

  await window.supabase.from("reactions").insert({
    artwork_id: artId,
    user_id: uid,
    emoji
  });
});
