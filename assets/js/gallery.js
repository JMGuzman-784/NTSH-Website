// Slideshow Functionality
let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let slideInterval;

function showSlides() {
  slides.forEach(slide => slide.style.display = "none");
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
}

function plusSlides(n) {
  clearInterval(slideInterval);
  slideIndex += n - 1;
  showSlides();
  slideInterval = setInterval(showSlides, 5000);
}

document.querySelector(".prev")?.addEventListener("click", () => plusSlides(-1));
document.querySelector(".next")?.addEventListener("click", () => plusSlides(1));

// Start slideshow on page load
document.addEventListener("DOMContentLoaded", () => {
  slides = document.querySelectorAll(".slide");
  showSlides();
  slideInterval = setInterval(showSlides, 5000);
});

// Lightbox Functionality
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const galleryImages = document.querySelectorAll('.slide img, .coverflow-gallery img');

galleryImages.forEach(image => {
  image.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = image.src;
    document.body.style.overflow = 'hidden'; // prevent scroll
  });
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  document.body.style.overflow = ''; // restore scroll
});
