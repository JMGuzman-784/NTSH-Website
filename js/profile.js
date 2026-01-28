// Upload modal controls
const modal = document.getElementById("upload-modal");
const openBtn = document.getElementById("open-upload");
const closeBtn = document.getElementById("close-upload");
const submitBtn = document.getElementById("submit-art");
const statusText = document.getElementById("upload-status");

openBtn.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");

// Shared storage helpers
function getArt() {
  return JSON.parse(localStorage.getItem("ntsh_art")) || [];
}

function saveArt(data) {
  localStorage.setItem("ntsh_art", JSON.stringify(data));
}

// Submit art
submitBtn.onclick = () => {
  const title = document.getElementById("art-title").value;
  const description = document.getElementById("art-description").value;
  const artType = document.getElementById("art-type").value;
  const stencilType = document.getElementById("stencil-type").value;
  const fileInput = document.getElementById("art-file");
  const file = fileInput.files[0];

  if (!title || !artType || !file) {
    statusText.textContent = "Please complete required fields.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const art = getArt();

    art.push({
      id: Date.now().toString(),
      title,
      description,
      artType,
      stencilType: stencilType || "N/A",
      artist: "Raid",
      image: reader.result,
      status: "pending",
      uploadedAt: new Date().toISOString()
    });

    saveArt(art);

    statusText.textContent = "Submitted for review ✔️";

    // Reset form
    document.getElementById("art-title").value = "";
    document.getElementById("art-description").value = "";
    document.getElementById("art-type").value = "";
    document.getElementById("stencil-type").value = "";
    fileInput.value = "";

    setTimeout(() => {
      modal.classList.add("hidden");
      statusText.textContent = "";
    }, 1200);
  };

  reader.readAsDataURL(file);
};
