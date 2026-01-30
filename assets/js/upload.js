// /assets/js/upload.js
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadArt");
  const modal = document.getElementById("uploadModal");
  const closeBtn = document.getElementById("closeUpload");
  const submitBtn = document.getElementById("submitArt");

  if (!uploadBtn || !modal) return;

  uploadBtn.onclick = () => {
    modal.classList.remove("hidden");
  };

  closeBtn.onclick = () => {
    modal.classList.add("hidden");
  };

  submitBtn.onclick = async () => {
    const fileInput = document.getElementById("artFile");
    const title = document.getElementById("artTitle").value;
    const desc = document.getElementById("artDesc").value;

    const file = fileInput.files[0];
    if (!file) {
      alert("Please select an image.");
      return;
    }

    const supabase = window.supabaseClient;
    const userId = sessionStorage.getItem("ntsh_uid");

    const filePath = `${userId}/${Date.now()}-${file.name}`;

    // 1️⃣ Upload to storage
    const { error: uploadError } = await supabase
      .storage
      .from("artworks")
      .upload(filePath, file);

    if (uploadError) {
      alert("Upload failed.");
      console.error(uploadError);
      return;
    }

    // 2️⃣ Get public URL
    const { data } = supabase
      .storage
      .from("artworks")
      .getPublicUrl(filePath);

    // 3️⃣ Insert DB row
    const { error: insertError } = await supabase
      .from("artworks")
      .insert({
        owner_id: userId,
        title,
        description: desc,
        image_url: data.publicUrl,
        status: "pending"
      });

    if (insertError) {
      alert("Failed to save artwork.");
      console.error(insertError);
      return;
    }

    modal.classList.add("hidden");
    alert("Artwork submitted for approval.");
  };
});
