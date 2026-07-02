/**
 * utils.js
 * Fonctions utilitaires génériques, réutilisables dans plusieurs modules.
 */

// ------------------------------------------------------------------
// Sécurité affichage (échappement HTML)
// ------------------------------------------------------------------

function escapeHtml(value) {

  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}
