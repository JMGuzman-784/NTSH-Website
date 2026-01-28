document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    console.error("Supabase client not available");
    return;
  }

  const supabaseClient = window.supabaseClient;

  const modal = document.getElementById("upload-modal");
  const openBtn = document.getElementById("uploadBtn");
  const closeBtn = document.getElementById("close-upload");
  const submitBtn = document.getElementById("submit-art");
  const statusText = document.getElementById("upload-status");

  if (openBtn) {
    openBtn.onclick = () => modal.classList.remove("hidden");
  }

  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add("hidden");
  }

  if (!submitBtn) return;

  submitBtn.onclick = async () => {
    statusText.textContent = "";

    const title = document.getElementById("art-title").value.trim();
    const description = document.getElementById("art-description").value.trim();
    const artType = document.getElementById("art-type").value;
    const stencilType = document.getElementById("stencil-type").value;
    const fileInput = document.getElementById("art-file");
    const file = fileInput.files[0];

    if (!title || !artType || !file) {
      statusText.textContent = "Please complete required fields.";
      return;
    }

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      statusText.textContent = "You must be logged in.";
      return;
    }

    // ✅ LIMIT TO 5 PENDING SUBMISSIONS
    const { data: existing } = await supabaseClient
      .from("artworks")
      .select("id")
      .eq("owner_id", user.id)
      .eq("status", "pending");

    if (existing && existing.length >= 5) {
      statusText.textContent =
        "You already have 5 submissions pending review.";
      return;
    }

    // Upload to storage
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("pending-art")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      statusText.textContent = "Upload failed.";
      return;
    }

    // Insert DB record
    const { error: insertError } = await supabaseClient
      .from("artworks")
      .insert({
        owner_id: user.id,
        title,
        description,
        art_type: artType,
        stencil_type: stencilType || null,
        file_path: filePath,
        status: "pending",
      });

    if (insertError) {
      console.error(insertError);
      statusText.textContent = "Failed to save artwork.";
      return;
    }

    // Success
    statusText.textContent = "Submitted for review ✔️";

    // Reset form
    document.getElementById("art-title").value = "";
    document.getElementById("art-description").value = "";
    document.getElementById("art-type").value = "";
    document.getElementById("stencil-type").value = "";
    fileInput.value = "";

    setTimeout(() => {
      modal.classList.add("hidden");
      statusText.textContent = "";
    }, 1200);
  };
});
