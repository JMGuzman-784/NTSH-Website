document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const { data, error } = await supabase.auth.getSession();

  if (!data?.session) {
    // NO SESSION = do nothing
    // index.html stays reachable
    sessionStorage.clear();
    return;
  }

  const user = data.session.user;

  sessionStorage.setItem("ntsh_uid", user.id);
  sessionStorage.setItem(
    "ntsh_user",
    user.user_metadata?.username || user.email
  );
  sessionStorage.setItem(
    "ntsh_role",
    user.user_metadata?.role || "viewer"
  );
});
