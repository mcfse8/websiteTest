/**
 * navigation.js
 * Met en surbrillance le lien du header correspondant à la page courante,
 * en comparant le pathname de l'URL aux href des liens du menu.
 */



function highlightActiveNavLink() {
  let currentPage = window.location.pathname.split('/').pop();

  if (currentPage === '') currentPage = 'index.html';

  // Redirections des pages vers l'onglet à activer
  const activeMap = {
    'exomcash.html': 'projects.html',
    'megese.html': 'projects.html',
  };

  currentPage = activeMap[currentPage] || currentPage;

  document.querySelectorAll('.nav-center a').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });
}

document.addEventListener('DOMContentLoaded', highlightActiveNavLink);
