// assets/js/auth-router.js

console.log("[Gate] Ready");

const supabase = window.supabaseClient;

// ---- DOM ----
const viewerBtn = document.getElementById("enterViewer");
const openLoginBtn = document.getElementById("openLogin");
const closeLoginBtn = document.getElementById("closeLogin");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");

// ---- VIEWER LOGIC ----
viewerBtn?.addEventListener("click", () => {
  sessionStorage.clear();

  const count = Number(localStorage.getItem("ntsh_viewer_count") || 0) + 1;
  localStorage.setItem("ntsh_viewer_count", count);

  sessionStorage.setItem("ntsh_role", "viewer");
  sessionStorage.setItem("ntsh_user", `viewer_${String(count).padStart(3, "0")}`);

  console.log("[Viewer] Entered as", sessionStorage.getItem("ntsh_user"));

  window.location.href = "/home.html";
});

// ---- LOGIN MODAL ----
openLoginBtn?.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

closeLoginBtn?.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

// ---- LOGIN / SIGNUP ----
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  console.log("[Auth] Login attempt:", email);

  // Try login first
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If user doesn't exist → sign up
  if (error && error.message.includes("Invalid login")) {
    console.log("[Auth] User not found, creating account");

    ({ data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "guest",
          username: email.split("@")[0],
        },
      },
    }));
  }

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  const user = data.user;
  if (!user) {
    alert("No user returned");
    return;
  }

  // ---- ROLE RESOLUTION ----
  let role = user.user_metadata?.role || "guest";
  let username = user.user_metadata?.username || user.email;

  // 🔒 HARD ADMIN RULE
  if (user.email === "ntshbusiness@gmail.com") {
    role = "admin";
    username = "Raid";
  }

  sessionStorage.clear();
  sessionStorage.setItem("ntsh_uid", user.id);
  sessionStorage.setItem("ntsh_role", role);
  sessionStorage.setItem("ntsh_user", username);

  console.log("[Auth] Logged in:", { role, username });

  // ---- REDIRECT ----
  if (role === "admin") {
    window.location.href = "/admin.html";
  } else {
    window.location.href = "/home.html";
  }
});
