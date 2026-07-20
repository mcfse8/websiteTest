/**
 * csv.js
 * Parsing du fichier CSV (séparateur ";") en tableau d'objets JS.
 * Ne conserve que les colonnes "Date" et "type".
 */

function parseCSV(csvText) {
  const lines = csvText
    .trim()
    .split(/\r?\n/);

  if (lines.length === 0) {
    return [];
  }

  const allHeaders = lines[0]
    .split(";")
    .map(h => h.trim());

  // Colonnes à conserver
  const wantedHeaders = ["date", "latitude", "longitude", "Country/Sea", "Region", "DAY/NIGHT", "cluster_category", "cluster_indicators", "ndetection", "cluster_number"];

  return lines.slice(1).map(line => {
    const values = line.split(";");
    const obj = {};

    wantedHeaders.forEach(header => {
      const index = allHeaders.indexOf(header);
      obj[header] = index !== -1 ? (values[index] || "") : "";
    });

    return obj;
  });
}
