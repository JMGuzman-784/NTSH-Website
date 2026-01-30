// assets/js/upload-art.js
// Handles artwork uploads (artists + admin only)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  const role = sessionStorage.getItem("ntsh_role");
  const uid = sessionStorage.getItem("ntsh_uid");

  if (!uid || (role !== "artist" && role !== "admin")) {
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("artFile");
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;

    if (!fileInput.files.length || !title) {
      alert("File and title required");
      return;
    }

    const file = fileInput.files[0];
    const path = `${uid}/${Date.now()}_${file.name}`;

    // 1️⃣ Upload to storage
    const { error: uploadError } = await window.supabase
      .storage
      .from("artworks")
      .upload(path, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    // 2️⃣ Insert DB row
    const { error: dbError } = await window.supabase
      .from("artworks")
      .insert({
        owner_id: uid,
        title,
        category,
        file_path: path,
        status: "pending"
      });

    if (dbError) {
      alert(dbError.message);
      return;
    }

    alert("Artwork submitted for approval");
    form.reset();
  });
});
