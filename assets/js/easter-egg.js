// /assets/js/easter-egg.js
// 10-click color shift easter egg

document.addEventListener("DOMContentLoaded", () => {
  const egg = document.querySelector(".easter-egg");
  if (!egg) return;

  let count = 0;

  egg.addEventListener("click", () => {
    count++;
    if (count === 10) {
      document.body.classList.toggle("alt-theme");
      count = 0;
    }
  });
});
