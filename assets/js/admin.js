const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3b3J3bGRwemlpbWhtY2F2amp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA4ODcsImV4cCI6MjA3NzQ4Njg4N30.Nf0vYb3-DEUgumWNi3hfV1M7Vu6guQE_gzob4Ee-lao";
// ===== ADMIN: REVIEW ONLY =====

function getArt() {
  return JSON.parse(localStorage.getItem("ntsh_art")) || [];
}

function saveArt(data) {
  localStorage.setItem("ntsh_art", JSON.stringify(data));
}

function approveArt(id) {
  const art = getArt().map(item =>
    item.id === id ? { ...item, status: "approved" } : item
  );
  saveArt(art);
  renderPending();
}

function rejectArt(id) {
  const art = getArt().map(item =>
    item.id === id ? { ...item, status: "rejected" } : item
  );
  saveArt(art);
  renderPending();
}

function renderPending() {
  const container = document.getElementById("pending-art");
  if (!container) return;

  const art = getArt();
  container.innerHTML = "";

  const pending = art.filter(a => a.status === "pending");

  if (pending.length === 0) {
    container.innerHTML = "<p>No pending submissions.</p>";
    return;
  }

  pending.forEach(item => {
    const card = document.createElement("div");
    card.style.border = "1px solid #333";
    card.style.padding = "12px";
    card.style.marginBottom = "12px";

    card.innerHTML = `
      <img src="${item.image}" style="max-width:100%;margin-bottom:8px;">
      <strong>${item.title}</strong><br>
      <em>${item.artType}</em><br>
      <small>Stencil: ${item.stencilType}</small><br>
      <p>${item.description || ""}</p>
      <button onclick="approveArt('${item.id}')">Approve</button>
      <button onclick="rejectArt('${item.id}')">Reject</button>
    `;

    container.appendChild(card);
  });
}

// Initial render
renderPending();
