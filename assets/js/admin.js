// assets/js/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) return;

  const role = sessionStorage.getItem("ntsh_role");
  if (role !== "admin") {
    window.location.href = "/home.html";
    return;
  }

  loadPendingArt();
  loadPendingUsers();
});

/* =======================
   PENDING ARTWORKS
======================= */

async function loadPendingArt() {
  const container = document.getElementById("pendingArt");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, owner_id, file_path, bucket")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach((art) => {
    const url = window.supabase.storage
      .from(art.bucket)
      .getPublicUrl(art.file_path).data.publicUrl;

    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img src="${url}" />
      <h4>${art.title}</h4>
      <div class="actions">
        <button onclick="approveArt('${art.id}')">Approve</button>
        <button onclick="rejectArt('${art.id}')">Reject</button>
      </div>
    `;

    container.appendChild(card);
  });
}

window.approveArt = async (id) => {
  await updateArtStatus(id, "approved");
};

window.rejectArt = async (id) => {
  await updateArtStatus(id, "rejected");
};

async function updateArtStatus(id, status) {
  const { error } = await window.supabase
    .from("artworks")
    .update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadPendingArt();
}

/* =======================
   PENDING USERS
======================= */

async function loadPendingUsers() {
  const container = document.getElementById("pendingUsers");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("profiles")
    .select("id, email, username, role, approved")
    .eq("approved", false);

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-card";

    div.innerHTML = `
      <strong>${user.email}</strong>
      <p>Username: ${user.username || "—"}</p>
      <div class="actions">
        <button onclick="approveUser('${user.id}')">Approve</button>
        <button onclick="rejectUser('${user.id}')">Reject</button>
      </div>
    `;

    container.appendChild(div);
  });
}

window.approveUser = async (id) => {
  const { error } = await window.supabase
    .from("profiles")
    .update({ approved: true, role: "artist" })
    .eq("id", id);

  if (error) alert(error.message);
  loadPendingUsers();
};

window.rejectUser = async (id) => {
  const { error } = await window.supabase
    .from("profiles")
    .update({ approved: false })
    .eq("id", id);

  if (error) alert(error.message);
  loadPendingUsers();
};
