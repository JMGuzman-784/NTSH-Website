(async () => {
  const { data, error } = await window.supabase.auth.getSession();

  if (error) {
    console.error("[Auth] session error", error);
    return;
  }

  if (data?.session?.user) {
    const user = data.session.user;
    const email = user.email;

    sessionStorage.setItem("ntsh_uid", user.id);
    sessionStorage.setItem("ntsh_email", email);

    if (email === "ntshbusiness@gmail.com") {
      sessionStorage.setItem("ntsh_role", "admin");
      sessionStorage.setItem("ntsh_name", "Raid");
    } else {
      sessionStorage.setItem("ntsh_role", "artist");
      sessionStorage.setItem("ntsh_name", email.split("@")[0]);
    }

    console.log("[Auth Core]", {
      role: sessionStorage.getItem("ntsh_role"),
      name: sessionStorage.getItem("ntsh_name")
    });
  } else {
    console.log("[Auth Core] no active session");
  }
})();
