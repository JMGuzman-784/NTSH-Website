// assets/js/admin.js

document.addEventListener("DOMContentLoaded", loadPending);

async function loadPending() {
  if (!window.supabase) return;

  const container = document.getElementById("pendingArt");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, owner_id")
    .eq("status", "pending");

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach((art) => {
    const row = document.createElement("div");
    row.className = "admin-row";

    row.innerHTML = `
      <strong>${art.title}</strong>
      <div>
        <button data-id="${art.id}" data-action="approve">Approve</button>
        <button data-id="${art.id}" data-action="reject">Reject</button>
      </div>
    `;

    container.appendChild(row);
  });
}

document.addEventListener("click", async (e) => {
  if (!e.target.dataset.action) return;

  const id = e.target.dataset.id;
  const status = e.target.dataset.action === "approve"
    ? "approved"
    : "rejected";

  await window.supabase
    .from("artworks")
    .update({ status })
    .eq("id", id);

  loadPending();
});
