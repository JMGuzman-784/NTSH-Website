// upload.js
import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("uploadModal");
  const openBtn = document.getElementById("uploadArtBtn");
  const closeBtn = document.getElementById("closeUpload");
  const submitBtn = document.getElementById("submitArt");

  if (!openBtn) return;

  openBtn.onclick = () => modal.classList.remove("hidden");
  closeBtn.onclick = () => modal.classList.add("hidden");

  submitBtn.onclick = async () => {
    const title = document.getElementById("artTitle").value;
    const file = document.getElementById("artFile").files[0];

    if (!file || !title) return alert("Missing fields");

    const user = (await supabase.auth.getUser()).data.user;

    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadErr } = await supabase.storage
      .from("artworks")
      .upload(path, file);

    if (uploadErr) return alert(uploadErr.message);

    await supabase.from("artworks").insert({
      owner_id: user.id,
      title,
      file_path: path,
      status: "pending"
    });

    modal.classList.add("hidden");
    alert("Submitted for approval");
  };
});
