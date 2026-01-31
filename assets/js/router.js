// /assets/js/router.js
import { setState, clearState } from "./state.js";

export function enterAsViewer() {
  clearState();

  const count = Number(sessionStorage.getItem("viewer_count") || 0) + 1;
  sessionStorage.setItem("viewer_count", count);

  setState({
    role: "viewer",
    username: `viewer_${String(count).padStart(3, "0")}`,
    uid: null
  });

  window.location.href = "/home.html";
}

export function routeAfterLogin(user) {
  clearState();

  let role = "guest";
  let username = user.user_metadata?.username || "guest";

  // 🔑 ADMIN OVERRIDE (YOU)
  if (user.email === "ntshbusiness@gmail.com") {
    role = "admin";
    username = "Raid";
  }

  setState({
    role,
    username,
    uid: user.id
  });

  window.location.href = "/home.html";
}
