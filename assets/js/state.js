
// /assets/js/state.js
// Manages session identity ONLY

window.NTSH_STATE = {
  get role() {
    return sessionStorage.getItem("ntsh_role") || "viewer";
  },

  get user() {
    return sessionStorage.getItem("ntsh_user") || "viewer_001";
  },

  set(role, user) {
    sessionStorage.setItem("ntsh_role", role);
    sessionStorage.setItem("ntsh_user", user);
  },

  clear() {
    sessionStorage.clear();
  }
};
