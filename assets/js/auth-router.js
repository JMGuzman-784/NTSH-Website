// assets/js/auth-router.js
// Central auth + role router for ALL pages

(function () {
  console.log("[Router] Loaded");

  const role = sessionStorage.getItem("ntsh_role");
  const user = sessionStorage.getItem("ntsh_user");
  const uid = sessionStorage.getItem("ntsh_uid");

  const path = window.location.pathname;

  console.log("[Router] State:", { role, user, uid, path });

  // ----------------------------------------
  // INDEX PAGE (ENTRY)
  // ----------------------------------------
  if (path.endsWith("/") || path.endsWith("/index.html")) {
    // If already authenticated, route forward
    if (role === "admin") {
      window.location.replace("/admin.html");
      return;
    }

    if (role === "guest" || role === "viewer") {
      window.location.replace("/home.html");
      return;
    }

    // Otherwise stay on index
    return;
  }

  // ----------------------------------------
  // LOGIN PAGE
  // ----------------------------------------
  if (path.endsWith("/login.html")) {
    // Logged-in users should not see login
    if (role === "admin") {
      window.location.replace("/admin.html");
      return;
    }

    if (role === "guest") {
      window.location.replace("/home.html");
      return;
    }

    return;
  }

  // ----------------------------------------
  // ADMIN PAGE
  // ----------------------------------------
  if (path.endsWith("/admin.html")) {
    if (role !== "admin") {
      console.warn("[Router] Admin access denied");
      sessionStorage.clear();
      window.location.replace("/index.html");
      return;
    }
    return;
  }

  // ----------------------------------------
  // HOME PAGE
  // ----------------------------------------
  if (path.endsWith("/home.html")) {
    // Viewer fallback (no auth but allowed)
    if (!role) {
      console.warn("[Router] No role, forcing viewer");
      sessionStorage.setItem("ntsh_role", "viewer");
      sessionStorage.setItem("ntsh_user", "viewer_001");
      return;
    }

    // Admin should NOT live on home
    if (role === "admin") {
      window.location.replace("/admin.html");
      return;
    }

    return;
  }

  // ----------------------------------------
  // PROFILE / SETTINGS (future-safe)
  // ----------------------------------------
  if (path.endsWith("/profile.html") || path.endsWith("/settings.html")) {
    if (!role) {
      window.location.replace("/index.html");
      return;
    }
  }
})();
