// assets/js/admin.js
document.addEventListener("DOMContentLoaded", async () => {
  const role = sessionStorage.getItem("ntsh_role");

  if (role !== "admin") {
    window.location.href = "/home.html";
    return;
  }

  const list = document.getElementById("pendingArt");
  if (!list) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin load error:", error.message);
    return;
  }

  list.innerHTML = "";

  data.forEach(art => {
    const row = document.createElement("div");
    row.className = "admin-art-row";

    row.innerHTML = `
      <span>${art.title}</span>
      <button data-id="${art.id}" data-action="approve">Approve</button>
      <button data-id="${art.id}" data-action="reject">Reject</button>
    `;

    list.appendChild(row);
  });

  list.addEventListener("click", async (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (!id || !action) return;

    await window.supabase
      .from("artworks")
      .update({ status: action === "approve" ? "approved" : "rejected" })
      .eq("id", id);

    btn.parentElement.remove();
  });
});
