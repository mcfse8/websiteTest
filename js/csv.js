/**
 * csv.js
 * Parsing du fichier CSV (séparateur ";") en tableau d'objets JS.
 */

function parseCSV(csvText) {

  const lines = csvText
    .trim()
    .split(/\r?\n/);

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0]
    .split(";")
    .map(h => h.trim());

  return lines.slice(1).map(line => {

    const values = line.split(";");

    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });

    return obj;

  });
}
