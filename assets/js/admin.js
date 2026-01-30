// /assets/js/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.page !== "admin") return;
  if (window.NTSH_STATE.role !== "admin") return;

  const supabase = window.supabaseClient;
  const container = document.querySelector(".admin-grid");

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending");

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach(art => {
    const card = document.createElement("div");
    card.className = "art-card";

    card.innerHTML = `
      <img src="${art.image_url}" />
      <p>${art.title || "Untitled"}</p>
      <button data-action="approve">Approve</button>
      <button data-action="reject">Reject</button>
    `;

    card.querySelector("[data-action='approve']").onclick = async () => {
      await supabase.from("artworks")
        .update({ status: "approved" })
        .eq("id", art.id);
      card.remove();
    };

    card.querySelector("[data-action='reject']").onclick = async () => {
      await supabase.from("artworks")
        .update({ status: "rejected" })
        .eq("id", art.id);
      card.remove();
    };

    container.appendChild(card);

    const userBox = document.getElementById("pending-users");

const { data: users } = await supabase
  .from("profiles")
  .select("*")
  .eq("username_approved", false);

users.forEach(u => {
  const row = document.createElement("div");
  row.innerHTML = `
    <span>${u.username}</span>
    <button>Approve</button>
  `;
  row.querySelector("button").onclick = async () => {
    await supabase.from("profiles")
      .update({ username_approved: true })
      .eq("id", u.id);
    row.remove();
  };
  userBox.appendChild(row);
});

  });
});
