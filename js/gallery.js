// Slideshow Logic
let currentSlide = 0;
const slides = document.querySelectorAll(".slideshow img");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function startSlideshow() {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000); // 5 seconds per slide
}

if (slides.length > 0) {
  showSlide(currentSlide);
  startSlideshow();
}

// Lightbox Logic
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const carouselImages = document.querySelectorAll('.carousel img');

carouselImages.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightbox.classList.add('active');
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
});
