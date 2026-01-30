// assets/js/admin-approve.js
// Admin-only approval system

document.addEventListener("DOMContentLoaded", async () => {
  const role = sessionStorage.getItem("ntsh_role");
  const uid = sessionStorage.getItem("ntsh_uid");
  const container = document.getElementById("pendingArt");

  if (!container || role !== "admin") return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Error loading submissions</p>";
    return;
  }

  if (!data.length) {
    container.innerHTML = "<p>No pending submissions</p>";
    return;
  }

  data.forEach(art => {
    const card = document.createElement("div");
    card.className = "pending-card";

    const img = document.createElement("img");
    img.src = window.supabase.storage
      .from("artworks")
      .getPublicUrl(art.file_path).data.publicUrl;

    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.onclick = () => updateStatus(art.id, "approved");

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject";
    rejectBtn.onclick = () => updateStatus(art.id, "rejected");

    card.append(img, approveBtn, rejectBtn);
    container.appendChild(card);
  });

  async function updateStatus(id, status) {
    await window.supabase
      .from("artworks")
      .update({ status })
      .eq("id", id);

    location.reload();
  }
});
