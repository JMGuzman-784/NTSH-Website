// assets/js/admin.js
document.addEventListener("DOMContentLoaded", async () => {
  const role = sessionStorage.getItem("ntsh_role");
  if (role !== "admin") return;

  const container = document.getElementById("pendingArt");
  if (!container) return;

  const { data, error } = await window.supabase
    .from("artworks")
    .select("id, title, file_path")
    .eq("status", "pending");

  if (error) {
    console.error("[Admin]", error);
    return;
  }

  container.innerHTML = "";

  data.forEach((art) => {
    const wrapper = document.createElement("div");
    wrapper.className = "pending-art";

    const img = document.createElement("img");
    img.src = window.supabase.storage
      .from("artworks")
      .getPublicUrl(art.file_path).data.publicUrl;

    const approve = document.createElement("button");
    approve.textContent = "Approve";
    approve.onclick = async () => {
      await window.supabase
        .from("artworks")
        .update({ status: "approved" })
        .eq("id", art.id);
      wrapper.remove();
    };

    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.onclick = async () => {
      await window.supabase
        .from("artworks")
        .update({ status: "rejected" })
        .eq("id", art.id);
      wrapper.remove();
    };

    wrapper.append(img, approve, reject);
    container.appendChild(wrapper);
  });
});
