// assets/js/upload.js

document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("uploadArt");
  if (!uploadInput) return;

  uploadInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uid = sessionStorage.getItem("ntsh_uid");
    const role = sessionStorage.getItem("ntsh_role");

    if (!uid || !["artist", "admin"].includes(role)) {
      alert("You are not allowed to upload.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${uid}/${crypto.randomUUID()}.${fileExt}`;

    // 1️⃣ Upload to Storage
    const { error: uploadError } = await window.supabase.storage
      .from("artworks")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed");
      return;
    }

    // 2️⃣ Insert DB row
    const { error: insertError } = await window.supabase
      .from("artworks")
      .insert({
        owner_id: uid,
        bucket: "artworks",
        file_path: filePath,
        status: "pending"
      });

    if (insertError) {
      console.error(insertError);
      alert("Database insert failed");
      return;
    }

    alert("Upload submitted for approval");
    uploadInput.value = "";
  });
});
