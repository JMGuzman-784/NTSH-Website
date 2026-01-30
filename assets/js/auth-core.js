// assets/js/auth-core.js
window.NTSH = window.NTSH || {};
const sb = NTSH.supabase;

NTSH.auth = {
  user: null,
  role: null,

  async load() {
    const { data } = await sb.auth.getSession();

    if (!data.session) {
      console.log("[Auth] No session");
      return null;
    }

    const user = data.session.user;
    const email = user.email;

    let role = user.user_metadata?.role || "guest";

    // 🔒 ADMIN RULE
    if (email === "ntshbusiness@gmail.com") {
      role = "admin";
    }

    NTSH.auth.user = {
      id: user.id,
      email,
      name: role === "admin" ? "Raid" : email.split("@")[0]
    };

    NTSH.auth.role = role;

    console.log("[Auth] Loaded", NTSH.auth);
    return NTSH.auth;
  },

  async login(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return this.load();
  },

  async logout() {
    await sb.auth.signOut();
    sessionStorage.clear();
    window.location.href = "/index.html";
  }
};
