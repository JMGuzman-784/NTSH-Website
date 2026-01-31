// assets/js/router.js
import { getState, setState } from "./state.js";

export function enterAsViewer() {
  let counter = Number(localStorage.getItem("ntsh_viewer_count") || 0);
  counter += 1;
  localStorage.setItem("ntsh_viewer_count", counter);

  const username = `viewer_${String(counter).padStart(3, "0")}`;

  setState({
    role: "viewer",
    username,
    uid: null
  });

  window.location.href = "/home.html";
}
