// assets/js/upload.js

document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadArtBtn");
  const modal = document.getElementById("uploadModal");
  const submitBtn = document.getElementById("submitArt");
  const closeBtn = document.getElementById("closeUpload");

  if (!uploadBtn || !modal) return;

  uploadBtn.onclick = () => modal.classList.remove("hidden");
  closeBtn.onclick = () => modal.classList.add("hidden");

  submitBtn.onclick = async () => {
    const title = document.getElementById("artTitle").value.trim();
    const desc = document.getElementById("artDesc").value.trim();
    const fileInput = document.getElementById("artFile");

    if (!title || !fileInput.files.length) {
      alert("Title and image required");
      return;
    }

    const file = fileInput.files[0];
    const uid = sessionStorage.getItem("ntsh_uid");

    const filePath = `${uid}/${Date.now()}-${file.name}`;

    // 1️⃣ Upload to storage
    const { error: uploadError } = await window.supabase
      .storage
      .from("artworks")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    // 2️⃣ Insert DB record
    const { error: insertError } = await window.supabase
      .from("artworks")
      .insert({
        owner_id: uid,
        title,
        description: desc,
        bucket: "artworks",
        file_path: filePath,
        status: "pending"
      });

    if (insertError) {
      alert(insertError.message);
      return;
    }

    modal.classList.add("hidden");
    alert("Artwork submitted for review");
  };
});
