// /assets/js/admin.js
// Admin moderation logic

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  if (page !== "admin") return;

  const role = window.NTSH_STATE.role;
  if (role !== "admin") return;

  const supabase = window.supabaseClient;

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  console.log("[ADMIN] Loaded artworks:", data);

  // UI hookup comes next phase
});
