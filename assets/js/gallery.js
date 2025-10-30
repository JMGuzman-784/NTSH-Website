const images = [
  "./assets/images/art1.jpg",
  "./assets/images/art2.jpg",
  "./assets/images/art3.jpg"
];

function showImage(index) {
  const mainImage = document.getElementById("mainImage");
  mainImage.src = images[index];
}

function openLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const mainImage = document.getElementById("mainImage");

  lightboxImg.src = mainImage.src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}
