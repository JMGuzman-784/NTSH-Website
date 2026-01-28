const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

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
  const { data: signed } = await supabaseClient
    .storage
    .from("pending-art")
    .createSignedUrl(art.file_path, 60 * 60);

  if (!signed?.signedUrl) return;

  const card = document.createElement("div");
  card.style.cssText = `
    background:#111;
    border-radius:14px;
    padding:12px;
    display:flex;
    flex-direction:column;
    gap:10px;
  `;

  card.innerHTML = `
    <img
      src="${signed.signedUrl}"
      style="width:100%; border-radius:10px; object-fit:cover;"
    />

    <div style="font-size:13px; opacity:.7;">
      ${art.description || "No description provided."}
    </div>

    <div style="display:flex; gap:8px;">
      <button class="approveBtn">Approve</button>
      <button class="rejectBtn">Reject</button>
    </div>
  `;

  card.querySelector(".approveBtn").onclick = () => approveArtwork(art);
  card.querySelector(".rejectBtn").onclick = () => rejectArtwork(art);

  styleAdminButtons(card);
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
