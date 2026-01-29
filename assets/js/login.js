// /assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const supabase = window.supabaseClient;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/home.html";
  });
});
