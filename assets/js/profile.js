document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not found");
    return;
  }

  const supabase = window.supabaseClient;

  const modal = document.getElementById("upload-modal");
  const openBtn = document.getElementById("uploadBtn");
  const closeBtn = document.getElementById("close-upload");
  const submitBtn = document.getElementById("submit-art");
  const statusText = document.getElementById("upload-status");

  if (openBtn) openBtn.onclick = () => modal.classList.remove("hidden");
  if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");

  if (!submitBtn) return;

  submitBtn.onclick = async (e) => {
    e.preventDefault();
    statusText.textContent = "";

    const title = document.getElementById("art-title").value.trim();
    const description = document.getElementById("art-description").value.trim();
    const fileInput = document.getElementById("art-file");
    const file = fileInput.files[0];

    if (!title || !file) {
      statusText.textContent = "Title and image required.";
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      statusText.textContent = "You must be logged in.";
      return;
    }

    // LIMIT: 5 pending submissions
    const { data: existing } = await supabase
      .from("artworks")
      .select("id")
      .eq("owner_id", user.id)
      .eq("status", "pending");

    if (existing && existing.length >= 5) {
      statusText.textContent = "You already have 5 pending submissions.";
      return;
    }

    // Upload file
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("pending-art")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      statusText.textContent = "Image upload failed.";
      return;
    }

    // Insert DB row (THIS FIXES YOUR BUCKET ERROR)
    const { error: insertError } = await supabase
      .from("artworks")
      .insert({
        owner_id: user.id,
        title,
        description,
        file_path: filePath,
        bucket: "pending-art",
        status: "pending",
      });

    if (insertError) {
      console.error(insertError);
      statusText.textContent = "Database error. Artwork not saved.";
      return;
    }

    statusText.textContent = "Submitted for review ✔️";

    document.getElementById("art-title").value = "";
    document.getElementById("art-description").value = "";
    fileInput.value = "";

    setTimeout(() => {
      modal.classList.add("hidden");
      statusText.textContent = "";
    }, 1200);
  };
});
