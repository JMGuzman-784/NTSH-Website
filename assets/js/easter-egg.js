let clicks = 0;

document.querySelector(".easter-egg")?.addEventListener("click", () => {
  clicks++;
  if (clicks >= 10) {
    document.body.classList.toggle("alt-theme");
    clicks = 0;
  }
});
