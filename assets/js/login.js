document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    console.log("[LOGIN ATTEMPT]", email);

    const { data, error } =
      await window.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("[LOGIN SUCCESS]", data.user.email);

    window.location.href = "/home.html";
  });
});
