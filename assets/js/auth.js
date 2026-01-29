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

 const user = data.session.user;

const email = user.email;
const isAdmin = email === "ntshbusiness@gmail.com";

sessionStorage.setItem("ntsh_uid", user.id);
sessionStorage.setItem("ntsh_user", user.user_metadata?.username || email);
sessionStorage.setItem("ntsh_role", isAdmin ? "admin" : "artist");

console.log("[NTSH Auth]", {
  role: isAdmin ? "admin" : "artist",
  user: user.email
});

});
