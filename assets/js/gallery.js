// ✅ Point to your image folder
const BASE_PATH = "assets/images";

const LIBRARY = {
  pencil: [
    { title: "Art 1", src: `${BASE_PATH}/pencil/art1.jpg` },
    { title: "Art 2", src: `${BASE_PATH}/pencil/art2.jpg` },
    { title: "Art 3", src: `${BASE_PATH}/pencil/art3.jpg` },
  ],
  pen: [
    { title: "Art 1", src: `${BASE_PATH}/pen/art1.jpg` },
    { title: "Art 2", src: `${BASE_PATH}/pen/art2.jpg` },
    { title: "Art 3", src: `${BASE_PATH}/pen/art3.jpg` },
  ],
  paint: [
    { title: "Art 1", src: `${BASE_PATH}/paint/art1.jpg` },
    { title: "Art 2", src: `${BASE_PATH}/paint/art2.jpg` },
    { title: "Art 3", src: `${BASE_PATH}/paint/art3.jpg` },
  ],
  photo: [
    { title: "Art 1", src: `${BASE_PATH}/photo/art1.jpg` },
    { title: "Art 2", src: `${BASE_PATH}/photo/art2.jpg` },
    { title: "Art 3", src: `${BASE_PATH}/photo/art3.jpg` },
  ],
};

const artList = document.getElementById("artList");
const imgEl = document.getElementById("display");
const captionEl = document.getElementById("caption");
const tabs = Array.from(document.querySelectorAll(".tab[role='tab']"));

let activeCat = "pencil";

function setActiveTab(cat) {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.cat === cat)));
}
function buildArtButtons(cat) {
  artList.innerHTML = "";
  const items = LIBRARY[cat] || [];
  items.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.className = "art-btn";
    btn.type = "button";
    btn.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${item.title}</span>`;
    btn.addEventListener("click", () => showImage(item));
    btn.addEventListener("keyup", (e) => { if (e.key === "Enter") showImage(item); });
    artList.appendChild(btn);
    if (i === 0) showImage(item);
  });
}
function showImage(item) {
  imgEl.src = item.src;
  imgEl.alt = `${item.title} — ${capitalize(activeCat)}`;
  captionEl.textContent = `${item.title} · ${capitalize(activeCat)}`;
}
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeCat = tab.dataset.cat;
    setActiveTab(activeCat);
    buildArtButtons(activeCat);
  });
  tab.addEventListener("keyup", (e) => { if (e.key === "Enter") tab.click(); });
});
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Init
setActiveTab(activeCat);
buildArtButtons(activeCat);
