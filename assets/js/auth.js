// /assets/js/auth.js
const SUPABASE_URL = "https://lworwldpziimhmcavjju.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_fnQZFa3JFPl8EWJBq1emLw_LsqPZYPP";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLIC_KEY
);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    sessionStorage.clear();

    // 🔥 ADMIN DETECTION (Raid only)
    if (email === "YOUR_ADMIN_EMAIL@DOMAIN.COM") {
      sessionStorage.setItem("ntsh_role", "admin");
      sessionStorage.setItem("ntsh_user", "Raid");
    } else {
      sessionStorage.setItem("ntsh_role", "guest");
      sessionStorage.setItem(
        "ntsh_user",
        user.user_metadata?.username || "guest_001"
      );
    }

    window.location.href = "/home.html";
  });
});
