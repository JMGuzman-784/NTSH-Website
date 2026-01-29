// /assets/js/auth.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("Supabase not loaded");
    return;
  }

  const supabaseUrl = "https://lworwldpziimhmcavjju.supabase.co";
  const supabaseKey = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP"; // sb_publishable_...

  if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );
    console.log("[Supabase] client ready");
  }

  const { data } = await window.supabaseClient.auth.getSession();
  const session = data?.session;

  if (!session) {
    console.log("[Auth] No session");
    return;
  }

  const user = session.user;
  const email = user.email;

  // 🔐 ADMIN CHECK (OPTION A)
  let role = "user";
  let username = "user_001";

  if (email === "ntshbusiness@gmail.com") {
    role = "admin";
    username = "Raid";
  }

  sessionStorage.setItem("ntsh_role", role);
  sessionStorage.setItem("ntsh_user", username);

  console.log("[NTSH Auth]", {
    role,
    user: username,
    email,
  });
});
