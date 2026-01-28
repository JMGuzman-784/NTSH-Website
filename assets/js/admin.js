const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";

let supabaseClient = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase SDK not loaded");
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    window.location.href = "/";
    return;
  }

  const role = document.body.dataset.role;
  if (role !== "admin") {
    alert("Admin access only.");
    window.location.href = "/profile.html";
    return;
  }

  loadPendingArtworks();
});

async function loadPendingArtworks() {
  const grid = document.getElementById("adminArtGrid");
  const empty = document.getElementById("adminEmptyState");

  grid.innerHTML = "";
  empty.textContent = "Loading pending submissions…";

  const { data: artworks, error } = await supabaseClient
    .from("artworks")
    .select("id, file_path, description, created_at")
    .eq("bucket", "pending-art")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    empty.textContent = "Failed to load submissions.";
    return;
  }

  if (!artworks || artworks.length === 0) {
    empty.textContent = "No pending submissions.";
    return;
  }

  empty.style.display = "none";

  for (const art of artworks) {
    renderArtworkCard(art, grid);
  }
}

async function renderArtworkCard(art, grid) {
  const { data, error } = await supabaseClient
    .storage
    .from("pending-art")
    .createSignedUrl(art.file_path, 3600);

  if (error || !data?.signedUrl) return;

  const card = document.createElement("div");
  card.style.background = "#111";
  card.style.borderRadius = "14px";
  card.style.padding = "12px";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.gap = "10px";

  const img = document.createElement("img");
  img.src = data.signedUrl;
  img.style.width = "100%";
  img.style.borderRadius = "10px";

  const desc = document.createElement("div");
  desc.textContent = art.description || "No description provided.";
  desc.style.fontSize = "13px";
  desc.style.opacity = "0.7";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const approveBtn = document.createElement("button");
  approveBtn.textContent = "Approve";
  approveBtn.style.flex = "1";
  approveBtn.style.padding = "8px";
  approveBtn.style.background = "#00ffe1";
  approveBtn.style.border = "none";
  approveBtn.style.borderRadius = "8px";
  approveBtn.style.fontWeight = "800";
  approveBtn.style.cursor = "pointer";

  const rejectBtn = document.createElement("button");
  rejectBtn.textContent = "Reject";
  rejectBtn.style.flex = "1";
  rejectBtn.style.padding = "8px";
  rejectBtn.style.background = "#222";
  rejectBtn.style.color = "#ff6b6b";
  rejectBtn.style.border = "1px solid rgba(255,255,255,.15)";
  rejectBtn.style.borderRadius = "8px";
  rejectBtn.style.fontWeight = "800";
  rejectBtn.style.cursor = "pointer";

  approveBtn.onclick = () => approveArtwork(art);
  rejectBtn.onclick = () => rejectArtwork(art);

  actions.appendChild(approveBtn);
  actions.appendChild(rejectBtn);

  card.appendChild(img);
  card.appendChild(desc);
  card.appendChild(actions);

  grid.appendChild(card);
}

async function approveArtwork(art) {
  const move = await supabaseClient.storage
    .from("pending-art")
    .move(art.file_path, art.file_path, {
      destinationBucket: "approved-art"
    });

  if (move.error) {
    alert("Failed to approve artwork.");
    return;
  }

  await supabaseClient
    .from("artworks")
    .update({ bucket: "approved-art" })
    .eq("id", art.id);

  loadPendingArtworks();
}

async function rejectArtwork(art) {
  if (!confirm("Reject this artwork?")) return;

  await supabaseClient.storage
    .from("pending-art")
    .remove([art.file_path]);

  await supabaseClient
    .from("artworks")
    .delete()
    .eq("id", art.id);

  loadPendingArtworks();
}
