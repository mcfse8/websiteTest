/**
 * navigation.js
 * Met en surbrillance le lien du header correspondant à la page courante,
 * en comparant le pathname de l'URL aux href des liens du menu.
 */

function highlightActiveNavLink() {
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '') currentPage = 'index.html';
  if (currentPage == 'exomcash.html') currentPage = 'projects.html';
  if (currentPage == 'megese.html') currentPage = 'projects.html';
  // if (currentPage == 'exomcash.html') currentPage = 'projects.html';

  document.querySelectorAll('.nav-center a').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });

}

document.addEventListener('DOMContentLoaded', highlightActiveNavLink);
