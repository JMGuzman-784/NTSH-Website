// admin.js
import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("pendingArt");

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "pending");

  if (error) return console.error(error);

  container.innerHTML = "";

  data.forEach(art => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${art.title}</strong>
      <button onclick="approve('${art.id}')">Approve</button>
      <button onclick="reject('${art.id}')">Reject</button>
    `;
    container.appendChild(div);
  });
});

window.approve = async id => {
  await supabase.from("artworks").update({ status: "approved" }).eq("id", id);
  location.reload();
};

window.reject = async id => {
  await supabase.from("artworks").update({ status: "rejected" }).eq("id", id);
  location.reload();
};
