// assets/js/upload.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadArtForm");
  if (!form) return;

  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role");

  if (!uid || role === "viewer") {
    form.remove();
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const file = form.file.files[0];

    if (!title || !file) {
      alert("Title and image required");
      return;
    }

    const filePath = `${uid}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await window.supabase.storage
      .from("artworks")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { error: insertError } = await window.supabase
      .from("artworks")
      .insert({
        owner_id: uid,
        title,
        file_path: filePath,
        status: "pending"
      });

    if (insertError) {
      alert(insertError.message);
      return;
    }

    alert("Artwork submitted for review");
    form.reset();
  });
});
