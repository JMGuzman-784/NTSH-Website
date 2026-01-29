// /assets/js/auth.js
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return;

  const user = session.user;

  // Admin hard-lock (Raid only)
  const isAdmin = user.email === "YOUR_ADMIN_EMAIL@HERE";

  sessionStorage.setItem("ntsh_uid", user.id);
  sessionStorage.setItem("ntsh_user", user.user_metadata?.username || "user");
  sessionStorage.setItem(
    "ntsh_role",
    isAdmin ? "admin" : (user.user_metadata?.role || "guest")
  );

  console.log("[NTSH Auth]", {
    role: sessionStorage.getItem("ntsh_role"),
    user: sessionStorage.getItem("ntsh_user")
  });
});
