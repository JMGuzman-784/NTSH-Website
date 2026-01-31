// assets/js/upload-art.js
// Upload artwork → Supabase Storage + artworks table

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openUploadBtn");
  const submitBtn = document.getElementById("submitArt");

  const titleInput = document.getElementById("artTitle");
  const descInput = document.getElementById("artDesc");
  const fileInput = document.getElementById("artFile");

  if (!openBtn || !submitBtn) return;
  if (!window.supabase) {
    console.error("[UPLOAD] Supabase not ready");
    return;
  }

  // ===== ROLE GATE =====
  const role = sessionStorage.getItem("ntsh_role");
  if (role === "viewer") {
    openBtn.style.display = "none";
    return;
  }

  openBtn.addEventListener("click", () => {
    openModal("uploadModal");
  });

  submitBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!file || !title) {
      alert("Title and image required");
      return;
    }

    const {
      data: { user },
      error: userErr,
    } = await window.supabase.auth.getUser();

    if (userErr || !user) {
      alert("Not authenticated");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    console.log("[UPLOAD] Uploading file…");

    // ===== STORAGE =====
    const { error: uploadErr } = await window.supabase.storage
      .from("artworks")
      .upload(filePath, file);

    if (uploadErr) {
      alert(uploadErr.message);
      return;
    }

    // ===== DB INSERT =====
    const { error: dbErr } = await window.supabase.from("artworks").insert({
      owner_id: user.id,
      title,
      description,
      bucket: "artworks",
      file_path: filePath,
      status: "pending",
    });

    if (dbErr) {
      alert(dbErr.message);
      return;
    }

    alert("Artwork submitted for approval");
    closeModal("uploadModal");

    titleInput.value = "";
    descInput.value = "";
    fileInput.value = "";
  });
});
