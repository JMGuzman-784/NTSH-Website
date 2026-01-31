// assets/js/profile.js

document.addEventListener("DOMContentLoaded", async () => {
  const uid = sessionStorage.getItem("ntsh_uid");
  const role = sessionStorage.getItem("ntsh_role");

  if (!uid) return;

  const { data: profile, error } = await window.supabase
    .from("profiles")
    .select("username, display_name, role, instagram, tiktok")
    .eq("id", uid)
    .single();

  if (error || !profile) return;

  // Basic info
  const nameEl = document.getElementById("profileName");
  const roleEl = document.getElementById("profileRole");
  if (nameEl) nameEl.textContent = profile.display_name || profile.username;
  if (roleEl) roleEl.textContent = profile.role;

  // Social links
  const socials = document.getElementById("profileSocials");
  if (socials) {
    if (profile.instagram) {
      socials.innerHTML += `<a href="${profile.instagram}" target="_blank">Instagram</a>`;
    }
    if (profile.tiktok) {
      socials.innerHTML += `<a href="${profile.tiktok}" target="_blank">TikTok</a>`;
    }
  }

  // Upload button visibility
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm && !["artist", "admin"].includes(profile.role)) {
    uploadForm.style.display = "none";
  }

  // Admin Panel button (Raid only)
  if (profile.role === "admin") {
    const adminBtn = document.createElement("button");
    adminBtn.textContent = "Admin Panel";
    adminBtn.onclick = () => (window.location.href = "/admin.html");
    document.getElementById("profileActions")?.appendChild(adminBtn);
  }

  // Load user's artworks
  const gallery = document.getElementById("profileGallery");
  if (!gallery) return;

  const { data: arts } = await window.supabase
    .from("artworks")
    .select("*")
    .eq("owner_id", uid)
    .order("created_at", { ascending: false });

  arts?.forEach((art) => {
    const img = document.createElement("img");
    img.src = window.supabase.storage
      .from(art.bucket)
      .getPublicUrl(art.file_path).data.publicUrl;

    img.className = "profile-art";

    // Delete (artist/admin only)
    if (["artist", "admin"].includes(profile.role)) {
      img.onclick = async () => {
        if (!confirm("Delete this artwork?")) return;

        await window.supabase.from("artworks").delete().eq("id", art.id);
        img.remove();
      };
    }

    gallery.appendChild(img);
  });
});
