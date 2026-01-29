// /assets/js/auth-gate.js
document.addEventListener("DOMContentLoaded", () => {
  const viewerBtn = document.getElementById("viewerBtn");
  const guestBtn = document.getElementById("guestBtn");
  const loginBtn = document.getElementById("loginBtn");

  viewerBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", "viewer_001");
    window.location.href = "/home.html";
  };

  guestBtn.onclick = () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "guest");
    sessionStorage.setItem("ntsh_user", "guest_001");
    window.location.href = "/home.html";
  };

  loginBtn.onclick = () => {
    window.location.href = "/login.html";
  };
});
