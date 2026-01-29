(async () => {
  const supabase = window.supabaseClient;
  const { data } = await supabase.auth.getSession();

  if (data?.session?.user) {
    const email = data.session.user.email;

    sessionStorage.setItem("ntsh_uid", data.session.user.id);
    sessionStorage.setItem("ntsh_user", email);

    // ADMIN DETECTION (LOCKED)
    if (email === "ntshbusiness@gmail.com") {
      sessionStorage.setItem("ntsh_role", "admin");
    } else {
      sessionStorage.setItem("ntsh_role", "artist");
    }

    console.log("[NTSH Auth]", {
      role: sessionStorage.getItem("ntsh_role"),
      user: email
    });

    return;
  }

  // ❗ NO SESSION → DO NOT OVERRIDE EXISTING ROLE
  console.log("[Auth] No session — using gate role");
})();
