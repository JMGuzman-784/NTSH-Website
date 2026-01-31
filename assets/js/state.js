// /assets/js/state.js
const KEY = "ntsh_state";

export function getState() {
  return JSON.parse(sessionStorage.getItem(KEY)) || null;
}

export function setState(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function clearState() {
  sessionStorage.removeItem(KEY);
}
