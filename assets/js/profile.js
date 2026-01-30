// assets/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("ntsh_role");

  if (role === "admin") {
    document.getElementById("adminLink").style.display = "block";
  }
});
