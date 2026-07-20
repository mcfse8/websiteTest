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

const CSV_FILE = "./data.csv";

let monitoringDataLoaded = false;

let allRows = [];

let currentPage = 1;

const rowsPerPage = 10;

async function loadMonitoringData(forceRefresh = false) {

  if (monitoringDataLoaded && !forceRefresh) {
    return;
  }

  const statusEl = document.getElementById("data-table-status");
  const refreshBtn = document.getElementById("data-table-refresh-btn");

  statusEl.textContent = "Chargement des données...";
  refreshBtn.disabled = true;

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

    const rows = parseCSV(csvText);

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
