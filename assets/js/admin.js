// assets/js/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  const role = sessionStorage.getItem("ntsh_role");
  if (role !== "admin") return;

  const container = document.getElementById("pending-art");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending")
    .order("created_at");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((art) => {
    const row = document.createElement("div");
    row.className = "pending-row";

    const { data: urlData } = window.supabase
      .storage
      .from(art.bucket)
      .getPublicUrl(art.file_path);

    row.innerHTML = `
      <img src="${urlData.publicUrl}" />
      <button data-id="${art.id}" data-action="approve">Approve</button>
      <button data-id="${art.id}" data-action="reject">Reject</button>
    `;

    row.addEventListener("click", async (e) => {
      const btn = e.target;
      if (!btn.dataset.action) return;

      const status = btn.dataset.action === "approve" ? "approved" : "rejected";

      await window.supabase
        .from("artworks")
        .update({
          status,
          approved_at: status === "approved" ? new Date() : null
        })
        .eq("id", btn.dataset.id);

      row.remove();
    });

    container.appendChild(row);
  });
});
