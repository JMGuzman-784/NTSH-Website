// assets/js/auth-guard.js
const role = sessionStorage.getItem("role");

if (!role) {
  window.location.href = "/index.html";
}
