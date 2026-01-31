// assets/js/state.js

const STATE_KEY = "ntsh_state";

export function getState() {
  const raw = sessionStorage.getItem(STATE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setState(state) {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function clearState() {
  sessionStorage.removeItem(STATE_KEY);
}

export function isViewer() {
  const s = getState();
  return s?.role === "viewer";
}
