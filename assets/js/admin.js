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

/* -----------------------------
   Load Pending Art (ADMIN)
-------------------------------- */
async function loadPendingArtworks() {
  const grid = document.getElementById("adminArtGrid");
  const empty = document.getElementById("adminEmptyState");

  grid.innerHTML = "";
  empty.textContent = "Loading pending submissions…";

  const { data: artworks, error } = await supabaseClient
    .from("artworks")
    .select(`
      id,
      file_path,
      description,
      owner_id,
      created_at
    `)
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

/* -----------------------------
   Render Admin Card
-------------------------------- */
async function renderArtworkCard(art, grid) {
  const { data: signed, error } = await supabaseClient
    .storage
    .from("pending-art")
    .createSignedUrl(art.file_path, 60 * 60);

  if (error || !signed?.signedUrl) return;

  const card = document.createElement("div");
  card.style.cssText = `
    background:#111;
    border-radius:14px;
    padding:12px;
    display:flex;
    flex-direction:column;
    gap:10px;
  `;

  const img = document.createElement("img");
  img.src = signed.signedUrl;
  img.style.width = "100%";
  img.style.borderRadius = "10px";
  img.style.objectFit = "cover";

  const desc = document.createElement("div");
  desc.textContent = art.description || "No description provided.";
  desc.style.fontSize = "13px";
  desc.style.opacity = ".7";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const approveBtn = document.createElement("button");
  approveBtn.textContent = "Approve";
  approveBtn.style.cssText = `
    flex:1;
    padding:8px;
    background:#00ffe1;
    color:#000;
    border:none;
    border-radius:8px;
    font-weight:800;
    cursor:pointer;
  `;

  const rejectBtn = document.createElement("button");
  rejectBtn.textContent = "Reject";
  rejectBtn.style.cssText = `
    flex:1;
    padding:8px;
    background:#222;
    color:#ff6b6b;
    border:1px solid rgba(255,255,255,.15);
    border-radius:8px;
    font-weight:800;
    cursor:pointer;
  `;

  approveBtn.onclick = () => approveArtwork(art);
  rejectBtn.onclick = () => rejectArtwork(art);

  actions.appendChild(approveBtn);
  actions.appendChild(rejectBtn);

  card.appendChild(img);
  card.appendChild(desc);
  card.appendChild(actions);

  grid.appendChild(card);
}

/* -----------------------------
   Button Styling
-------------------------------- */
function styleAdminButtons(card) {
  const approve = card.querySelector(".approveBtn");
  const reject = card.querySelector(".rejectBtn");

  approve.style.cssText = `
    flex:1;
    padding:8px;
    background:#00ffe1;
    color:#000;
    border:none;
    border-radius:8px;
    font-weight:800;
    cursor:pointer;
  `;

  reject.style.cssText = `
    flex:1;
    padding:8px;
    background:#222;
    color:#ff6b6b;
    border:1px solid rgba(255,255,255,.15);
    border-radius:8px;
    font-weight:800;
    cursor:pointer;
  `;
}

/* -----------------------------
   Approve
-------------------------------- */
async function approveArtwork(art) {
  const move = await supabaseClient
    .storage
    .from("pending-art")
    .move(art.file_path, art.file_path, {
      destinationBucket: "
