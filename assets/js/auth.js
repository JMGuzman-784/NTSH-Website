// /assets/js/auth.js

document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return;

  const user = data.session.user;

  sessionStorage.setItem("ntsh_uid", user.id);
  sessionStorage.setItem("ntsh_user", user.user_metadata?.username || user.email);
  sessionStorage.setItem("ntsh_role", user.user_metadata?.role || "guest");
});


  if (window.supabaseClient) return;

  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co";
  // ✅ USE YOUR NEW PUBLISHABLE KEY HERE
  const supabaseKey = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

  const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

  window.supabaseClient = supabase;

  supabase.auth.getSession().then(({ data }) => {
    if (!data?.session) return;

    const user = data.session.user;

    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem(
      "ntsh_user",
      user.user_metadata?.username || "viewer_001"
    );
    sessionStorage.setItem(
      "ntsh_role",
      user.user_metadata?.role || "viewer"
    );
  });
});
