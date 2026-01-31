// reactions.js
import { supabase } from "./supabase-client.js";

document.querySelectorAll(".reactions button").forEach(btn => {
  btn.onclick = async () => {
    const artId = btn.closest(".reactions").dataset.artId;
    const emoji = btn.dataset.emoji;

    await supabase.from("reactions").insert({
      artwork_id: artId,
      emoji
    });
  };
});
