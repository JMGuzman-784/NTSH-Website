// assets/js/viewer.js

document.addEventListener("DOMContentLoaded", async () => {
  let viewerId = sessionStorage.getItem("ntsh_user");

  if (!viewerId) {
    const { count } = await window.supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "viewer");

    const next = String(count + 1).padStart(3, "0");
    viewerId = `viewer_${next}`;

    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", viewerId);
  }

  const nameEl = document.getElementById("accountName");
  if (nameEl) nameEl.textContent = viewerId;
});
