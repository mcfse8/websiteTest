/**
 * pagination.js
 * Navigation entre les pages du tableau de données (Products).
 * Dépend des variables globales `allRows`, `currentPage`, `rowsPerPage`
 * et de la fonction `renderDataTable` (définies dans products.js).
 */

function renderDataTablePage() {

  const start =
    (currentPage - 1) * rowsPerPage;

  const end =
    start + rowsPerPage;

  const rows =
    allRows.slice(start, end);

  renderDataTable(rows);

  const totalPages =
    Math.ceil(allRows.length / rowsPerPage);

  document.getElementById("page-info").textContent =
    `Page ${currentPage} / ${totalPages}`;
}

function nextPage() {

  const totalPages =
    Math.ceil(allRows.length / rowsPerPage);

  if (currentPage < totalPages) {

    currentPage++;

    renderDataTablePage();
  }
}

function previousPage() {

  if (currentPage > 1) {

    currentPage--;

    renderDataTablePage();
  }
}
