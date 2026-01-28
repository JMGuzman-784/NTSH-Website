<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>NTSH — Admin Panel</title>

  <!-- Shared styles -->
  <link rel="stylesheet" href="assets/css/gallery.css?v=1" />
  <link rel="stylesheet" href="assets/css/account-ui.css?v=1" />

  <!-- Supabase -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js" defer></script>

  <!-- Admin logic (Phase 2) -->
  <script defer src="assets/js/admin.js?v=1"></script>
</head>

<body>
  <!-- HEADER -->
  <header class="site-header header-row">
    <div class="header-left">
      <div class="brand">
        <span class="logo-dot"></span>
        <h1>NTSH</h1>
      </div>
      <p>Admin Panel — Review Submissions</p>
    </div>

    <div class="header-right">
      <a href="/profile.html"
         style="color:#00ffe1; font-weight:800; text-decoration:none;">
        ← Back to Profile
      </a>
    </div>
  </header>

  <!-- MAIN -->
  <main class="wrap">
    <section class="content glass" style="padding:20px;">

      <h2 style="margin-top:0;">Pending Artwork Submissions</h2>

      <!-- Empty state (replaced in Phase 2) -->
      <p id="adminEmptyState" style="opacity:.6;">
        Loading pending submissions…
      </p>

      <!-- Admin review grid -->
      <div
        id="adminArtGrid"
        style="
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:16px;
          margin-top:20px;
        "
      >
        <!-- Cards injected in Phase 2 -->
      </div>

    </section>
  </main>
</body>
</html>
