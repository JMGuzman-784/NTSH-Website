// /assets/js/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  const role = sessionStorage.getItem("ntsh_role");
  if (role !== "admin") return;

  const supabase = window.supabaseClient;
  const container = document.getElementById("pending-art");

  const { data } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending");

  container.innerHTML = "";

  data.forEach(art => {
    const row = document.createElement("div");
    row.innerHTML = `
      <strong>${art.title}</strong>
      <button onclick="approve('${art.id}')">Approve</button>
      <button onclick="reject('${art.id}')">Reject</button>
    `;
    container.appendChild(row);
  });
});

async function approve(id) {
  await window.supabaseClient.from("artworks").update({ status: "approved" }).eq("id", id);
  location.reload();
}

async function reject(id) {
  await window.supabaseClient.from("artworks").update({ status: "denied" }).eq("id", id);
  location.reload();
}
