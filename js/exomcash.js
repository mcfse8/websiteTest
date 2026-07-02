const axeContent = {
  detection: {
    title: "Détection temps réel d'évènements extrêmes atmosphériques",
    text: "Description détaillée de cet axe de recherche...",
    image: "../Media/logos/logoCNES.webp",
  },
  quantification: {
    title: "Quantification des émissions de polluants",
    text: "Description détaillée de cet axe...",
    image: "../Media/quantification.jpg",
  },
  ozone: {
    title: "Analyse et évaluation de la mesure de l'ozone",
    text: "Description détaillée de cet axe...",
    image: "../Media/ozone.jpg",
  },
  concepts: {
    title: "Études pour de nouveaux concepts de mission opérationnelle",
    text: "Description détaillée de cet axe...",
    image: "../Media/concepts.jpg",
  },
};

function renderAxeDetail(axeKey) {
  const data = axeContent[axeKey];
  const container = document.getElementById("axe-detail");
  if (!data || !container) return;

  container.innerHTML = `
    <h3 class="axe-detail__title">${data.title}</h3>
    <p>${data.text}</p>
    ${data.image ? `<img class="axe-detail__img" src="${data.image}" alt="${data.title}">` : ""}
  `;
}

function initExomcashGrid() {
  const boxes = document.querySelectorAll(".exomcash-grid .box");
  if (!boxes.length) return;

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      boxes.forEach((b) => b.classList.remove("active"));
      box.classList.add("active");
      renderAxeDetail(box.dataset.axe);
    });
  });

  // Affiche le premier axe par défaut
  boxes[0].classList.add("active");
  renderAxeDetail(boxes[0].dataset.axe);
}

document.addEventListener("DOMContentLoaded", initExomcashGrid);