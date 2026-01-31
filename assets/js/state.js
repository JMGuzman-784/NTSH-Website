// assets/js/state.js
// Global NTSH state manager (single source of truth)

// assets/js/state.js

export function setViewer() {
  sessionStorage.clear();

  sessionStorage.setItem("ntsh_role", "viewer");
  sessionStorage.setItem("ntsh_user", "viewer");
  sessionStorage.setItem("ntsh_uid", "viewer");

  console.log("[STATE] Viewer session set");
}


window.NTSH_STATE = {
  uid: null,
  role: null,
  username: null,
  email: null,
  ready: false
};

export function loadState() {
  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role");
  const username = sessionStorage.getItem("ntsh_user");
  const email = sessionStorage.getItem("ntsh_email");

  window.NTSH_STATE = {
    uid,
    role,
    username,
    email,
    ready: true
  };

  console.log("[STATE] Loaded", window.NTSH_STATE);
  return window.NTSH_STATE;
}

export function clearState() {
  sessionStorage.clear();
  window.NTSH_STATE = {
    uid: null,
    role: null,
    username: null,
    email: null,
    ready: false
  };
  console.log("[STATE] Cleared");
}
