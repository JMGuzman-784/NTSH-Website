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
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const previewContainer = document.getElementById("preview");

// Trigger file dialog
dropArea.addEventListener("click", () => fileInput.click());

// Highlight on drag
["dragenter", "dragover"].forEach(eventName =>
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    dropArea.classList.add("highlight");
  })
);

// Unhighlight
["dragleave", "drop"].forEach(eventName =>
  dropArea.addEventListener(eventName, () => dropArea.classList.remove("highlight"))
);

// Handle dropped files
dropArea.addEventListener("drop", e => {
  e.preventDefault();
  const files = [...e.dataTransfer.files];
  handleFiles(files);
});

// Handle selected files
fileInput.addEventListener("change", () => {
  const files = [...fileInput.files];
  handleFiles(files);
});

// Display preview
function handleFiles(files) {
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Uploaded art";
      img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        document.body.style.overflow = "hidden";
      });
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}
