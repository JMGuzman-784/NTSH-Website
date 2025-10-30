document.getElementById('imageUpload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.alt = 'Uploaded NTSH Art';
    img.classList.add('uploaded-art');

    document.querySelector('.gallery').appendChild(img);
  };
  reader.readAsDataURL(file);
});
