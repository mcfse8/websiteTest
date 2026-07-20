/**
 * products.js
 * ── DATA TABLE (Products page) ──
 * Récupère les données depuis le fichier CSV statique (généré par un
 * script d'extraction indépendant) et remplit le tableau de la page Products.
 *
 * Dépend de : parseCSV() (csv.js), escapeHtml() (utils.js),
 * renderDataTablePage() (pagination.js).
 */

// ------------------------------------------------------------------
// Chargement direct d'un fichier CSV
// ------------------------------------------------------------------

const CSV_FILE = "../data.csv";

let monitoringDataLoaded = false;

let allRows = [];

let currentPage = 1;

const rowsPerPage = 10;

async function loadMonitoringData(forceRefresh = false) {

  if (monitoringDataLoaded && !forceRefresh) {
    return allRows;
  }

  const statusEl = document.getElementById("data-table-status");
  const refreshBtn = document.getElementById("data-table-refresh-btn");

  statusEl.textContent = "Chargement des données...";
  refreshBtn.disabled = true;

  let rows=[];

  try {

    const response = await fetch(
      `${CSV_FILE}?t=${Date.now()}`
    );

    console.log("Status :", response.status);
    console.log("OK :", response.ok);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const csvText = await response.text();

    rows = parseCSV(csvText);

    allRows = rows;

    currentPage = 1;

    renderDataTablePage();

    statusEl.textContent =
      `${rows.length} ligne(s) chargée(s)`;

    monitoringDataLoaded = true;

  } catch (error) {

    console.error(error);

    statusEl.textContent =
      "Impossible de charger le fichier CSV";

    document.getElementById("data-table-body").innerHTML =
      `<tr>
        <td colspan="99" class="data-table-error">
          Erreur de chargement
        </td>
      </tr>`;

  } finally {

    refreshBtn.disabled = false;

  }

  return rows;
}


// ------------------------------------------------------------------
// Affichage du tableau
// ------------------------------------------------------------------

function renderDataTable(rows) {

  const thead = document.getElementById("data-table-head");
  const tbody = document.getElementById("data-table-body");

  if (!rows.length) {

    thead.innerHTML = "";

    tbody.innerHTML =
      `<tr>
        <td colspan="99" class="data-table-empty">
          Aucune donnée disponible
        </td>
      </tr>`;

    return;
  }

  const headers = Object.keys(rows[0]);

  thead.innerHTML =
    `<tr>
      ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}
    </tr>`;

  tbody.innerHTML = rows.map(row => `
      <tr>
        ${headers.map(header =>
          `<td>${escapeHtml(row[header])}</td>`
        ).join("")}
      </tr>
  `).join("");
}

// ------------------------------------------------------------------
// AFFICHAGE MAP
// ------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", async () => {
    console.log("Appel DisplayMap()");
    await CreateMap();
});

/* Palette de couleurs */

const clusterColors = {
    fire: "#e41a1c",
    others: "#377eb8",
    volcano: "#984ea3",
    fire_type_1: "#ff7f00",
    voc: "#ffff33"
};

let map;
let pointLayer;
let hullLayer;

let allData = [];

let currentDate = "2026-02-20";
let currentPeriod = "ALL";

/* Carte */

function createMap() {

    const map = L.map("map").setView([46.5, 2.5], 6);

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);

    return map;
}

/* Filtrage */

function filterData(data) {

    return data.filter(point => {

        const okDate =
            point.date === currentDate;

        const okPeriod =
            currentPeriod === "ALL"
            || point["DAY/NIGHT"] === currentPeriod;

        return okDate && okPeriod;

    });

}

/* Refresh */

function refreshMap() {

    pointLayer.clearLayers();
    hullLayer.clearLayers();

    const data = filterData(allData);

    drawPoints(pointLayer, data);

    drawClusterHulls(hullLayer, data);

}
/* Couleur d'un cluster */

function getClusterColor(clusterCategory) {

    return clusterColors[clusterCategory] || "#666666";

}

/* Affichage des points */

function drawPoints(pointLayer, data) {

    data.forEach(point => {

        const color = getClusterColor(point.cluster_category);

        L.circleMarker(
            [
                Number(point.latitude),
                Number(point.longitude)
            ],
            {
                radius: 3,
                color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 1
            }
        )
        .bindPopup(createPopup(point))
        .addTo(pointLayer);

    });

}

/* Popup */

function createPopup(point) {

    return `
        <b>Date :</b> ${point.date} ${point["DAY/NIGHT"]}<br>
        <b>Cluster :</b> ${point.cluster_number}<br>
        <b>Catégorie :</b> ${point.cluster_category}<br>
        <b>Pays :</b> ${point["Country/Sea"]}<br>
        <b>Région :</b> ${point.Region}<br>
    `;

}

/* Regroupement des points par cluster */

function groupByCluster(data) {

    const clusters = {};

    data.forEach(point => {

        const id = point.cluster_number;

        if (!clusters[id]) {
            clusters[id] = [];
        }

        clusters[id].push(point);

    });

    return clusters;

}

/* Dessin des enveloppes convexes */

function drawClusterHulls(hullLayer, data) {

    const clusters = groupByCluster(data);

    Object.entries(clusters).forEach(([clusterId, points]) => {

        if (points.length < 3)
            return;

        const hull = computeConvexHull(points);

        if (!hull)
            return;

        const color = getClusterColor(points[0].cluster_category);

        L.geoJSON(hull, {

            style: {
                color: color,
                fillColor: color,
                fillOpacity: 0.20,
                weight: 2
            },

            onEachFeature(feature, layer) {

                layer.bindPopup(`
                    <b>Cycle : </b> ${point["DAY/NIGHT"]}<br>
                    <b>Cluster :</b> ${clusterId}<br>
                    <b>Catégorie :</b> ${points[0].cluster_category}<br>
                    <b>Nombre de points :</b> ${points.length}
                `);

            }

        }).addTo(hullLayer);

    });

}

/* Calcul de l'enveloppe convexe (Turf) */

function computeConvexHull(points) {

    const features = points.map(point =>

        turf.point([
            Number(point.longitude),
            Number(point.latitude)
        ])

    );

    const collection = turf.featureCollection(features);

    return turf.convex(collection);

}

/* Bouton Day Night */ 

function addDayNightControl(map) {

    const Control = L.Control.extend({

        onAdd: function () {

            const div = L.DomUtil.create("div", "leaflet-bar");

            div.innerHTML = `
                <button id="btnAll">ALL</button>
                <button id="btnDay">DAY</button>
                <button id="btnNight">NIGHT</button>
            `;

            return div;
        }

    });

    new Control({ position: "topright" }).addTo(map);

    setTimeout(() => {

        document
            .getElementById("btnAll")
            .onclick = () => {

                currentPeriod = "ALL";

                refreshMap();

            };

        document
            .getElementById("btnDay")
            .onclick = () => {

                currentPeriod = "DAY";

                refreshMap();

            };

        document
            .getElementById("btnNight")
            .onclick = () => {

                currentPeriod = "NIGHT";

                refreshMap();

            };

    });

}