// assets/js/profile.js

document.addEventListener("DOMContentLoaded", async () => {
  const uid = sessionStorage.getItem("ntsh_uid");
  if (!uid) return;

  const { data, error } = await window.supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", uid)
    .single();

  if (error) return;

  document.getElementById("profileName").textContent = data.display_name;

  if (data.role === "admin") {
    const btn = document.createElement("button");
    btn.textContent = "Admin Panel";
    btn.onclick = () => window.location.href = "/admin.html";
    document.getElementById("profileActions").appendChild(btn);
  }
});
