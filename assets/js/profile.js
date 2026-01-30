// /assets/js/profile.js
// Profile display logic

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page !== "profile") return;

  const usernameEl = document.getElementById("username");
  const roleEl = document.getElementById("role");
  const adminBtn = document.getElementById("adminPanel");

  const role = window.NTSH_STATE.role;
  const user = window.NTSH_STATE.user;

  if (usernameEl) usernameEl.textContent = user;
  if (roleEl) roleEl.textContent = role;

  // Show admin panel button ONLY for Raid
  if (role === "admin" && adminBtn) {
    adminBtn.hidden = false;
    adminBtn.onclick = () => {
      window.location.href = "/admin.html";

      if (role === "guest") {
  const notice = document.createElement("p");
  notice.textContent = "Username pending approval.";
  document.querySelector(".profile-card").appendChild(notice);
}

    };
  }
});
