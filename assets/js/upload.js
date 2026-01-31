// assets/js/upload.js
import { closeModal } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("artFile").files[0];
    const title = document.getElementById("artTitle").value;
    const uid = sessionStorage.getItem("ntsh_uid");

    if (!file || !uid) return alert("Missing file or user");

    const path = `${uid}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await window.supabase
      .storage.from("artworks")
      .upload(path, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { error } = await window.supabase.from("artworks").insert({
      owner_id: uid,
      title,
      file_path: path,
      status: "pending"
    });

    if (error) {
      alert(error.message);
      return;
    }

    closeModal("uploadModal");
    alert("Artwork submitted for review");
  });
});
