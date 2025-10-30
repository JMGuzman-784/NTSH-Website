// assets/js/upload.js

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const galleryWrapper = document.querySelector('.gallery-wrapper');

  // Open file dialog on click
  dropZone.addEventListener('click', () => fileInput.click());

  // Highlight drop zone on drag
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('highlight');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('highlight');
  });

  // Handle dropped files
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('highlight');
    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
  });

  // Handle files selected via input
  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    handleUpload(files);
  });

  // Upload handler
  async function handleUpload(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed.');

      const data = await res.json();
      data.uploaded.forEach((imgPath) => {
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = 'Uploaded Artwork';
        galleryWrapper.appendChild(img);
      });

    } catch (err) {
      alert('Error uploading image(s): ' + err.message);
    }
  }
});

