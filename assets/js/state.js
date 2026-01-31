// assets/js/state.js
export function getViewerId() {
  let id = sessionStorage.getItem("ntsh_viewer_id");

  if (!id) {
    const count = Number(localStorage.getItem("ntsh_viewer_count") || 0) + 1;
    localStorage.setItem("ntsh_viewer_count", count);
    id = `viewer_${String(count).padStart(3, "0")}`;
    sessionStorage.setItem("ntsh_viewer_id", id);
  }

  return id;
}
