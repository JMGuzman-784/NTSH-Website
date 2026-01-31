// assets/js/auth-guard.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("[AuthGuard] Supabase not loaded");
    return;
  }

  const {
    data: { session },
  } = await window.supabase.auth.getSession();

  const page = document.body.dataset.page;

  console.log("[AuthGuard]", { page, session });

  // Pages that REQUIRE auth
  const protectedPages = ["home", "profile", "admin"];

  if (protectedPages.includes(page) && !session) {
    console.warn("[AuthGuard] No session → redirect index");
    window.location.href = "/index.html";
    return;
  }

  // Admin-only protection
  if (page === "admin") {
    const email = session?.user?.email;
    if (email !== "ntshbusiness@gmail.com") {
      console.warn("[AuthGuard] Not admin");
      window.location.href = "/home.html";
    }
  }
});
