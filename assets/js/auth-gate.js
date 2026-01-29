document.addEventListener("DOMContentLoaded", () => {
  console.log("[Gate] Ready");

  const viewerBtn = document.getElementById("enterViewer");
  const guestBtn  = document.getElementById("enterGuest");
  const loginBtn  = document.getElementById("enterLogin");

  viewerBtn?.addEventListener("click", () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "viewer");
    sessionStorage.setItem("ntsh_user", "viewer_001");
    window.location.href = "/home.html";
  });

  guestBtn?.addEventListener("click", () => {
    sessionStorage.clear();
    sessionStorage.setItem("ntsh_role", "guest");
    sessionStorage.setItem("ntsh_user", "guest_001");
    window.location.href = "/home.html";
  });

  loginBtn?.addEventListener("click", () => {
    window.location.href = "/login.html";
  });
});
