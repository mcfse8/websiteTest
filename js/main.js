/**
 * main.js
 * Point d'entrée principal du site Spascia.
 *
 * Ce fichier ne contient pas de logique propre : il sert de point
 * d'orchestration / de documentation sur l'ordre de chargement des
 * scripts. Toute la logique applicative est répartie dans des modules
 * dédiés, à inclure dans le HTML dans l'ordre suivant :
 *
 *   1. js/utils.js        → fonctions utilitaires (escapeHtml, ...)
 *   2. js/csv.js           → parsing du CSV (parseCSV)
 *   3. js/products.js      → chargement & rendu du tableau Products
 *   4. js/pagination.js    → navigation entre les pages du tableau
 *   5. js/navigation.js    → routage entre les pages du site (showPage)
 *   6. js/main.js           → (ce fichier, en dernier)
 *
 * Exemple d'inclusion dans le HTML :
 *
 *   <script src="js/utils.js"></script>
 *   <script src="js/csv.js"></script>
 *   <script src="js/products.js"></script>
 *   <script src="js/pagination.js"></script>
 *   <script src="js/navigation.js"></script>
 *   <script src="js/main.js"></script>
 *
 * Si une initialisation globale (analytics, listeners transverses,
 * feature flags, etc.) doit être ajoutée plus tard, c'est ici qu'elle
 * doit prendre place.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Réservé aux initialisations globales futures.
});
