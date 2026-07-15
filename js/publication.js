(async function(){

  const DATA_URL = '../publis.xlsx';
  const contentEl = document.getElementById('content');
  const coreStripEl = document.getElementById('coreStrip');
  const statsEl = document.getElementById('stats');

  function escapeHtml(str){
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Wrap any names listed in company_Authors, wherever they occur inside the
  // Authors string, in a highlighted span. Longest names are matched first so
  // a short name can't clip inside a longer one that contains it.
  function highlightCompanyAuthors(authorsRaw, companyAuthorsRaw){
    let authorsHtml = escapeHtml(authorsRaw);
    if (!companyAuthorsRaw) return authorsHtml;

    const names = String(companyAuthorsRaw)
      .split(/[;,/|]/)
      .map(s => s.trim())
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    names.forEach(name => {
      const escapedName = escapeHtml(name);
      const pattern = escapedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(pattern, 'gi');
      authorsHtml = authorsHtml.replace(re, matched => `<span class="company-author">${matched}</span>`);
    });

    return authorsHtml;
  }

  function buildDoiLink(doiRaw){
    if (!doiRaw) return '';
    const doi = String(doiRaw).trim();
    if (!doi) return '';
    const href = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
    return `<a class="doi-link" href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, ''))}</a>`;
  }

  function renderEmpty(message, hint){
    contentEl.innerHTML = `
      <div class="state-box">
        <p>${message}</p>
        ${hint ? `<p>${hint}</p>` : ''}
      </div>
    `;
  }

  function render(rows){
    if (!rows.length){
      renderEmpty('Aucune publication trouvée dans le fichier.', 'Vérifie que la première feuille de <code>publis.xlsx</code> contient bien des lignes de données.');
      return;
    }

    // group by year, descending
    const byYear = new Map();
    rows.forEach(r => {
      const year = String(r.Year ?? '').trim() || 's.d.';
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(r);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => {
      const na = parseInt(a, 10), nb = parseInt(b, 10);
      if (isNaN(na)) return 1;
      if (isNaN(nb)) return -1;
      return nb - na;
    });

    // stats
    const totalCitations = rows.reduce((sum, r) => sum + (parseInt(r.Citations, 10) || 0), 0);
    statsEl.innerHTML = `
      <span><b>${rows.length}</b>publications</span>
      <span><b>${years.length}</b>années couvertes</span>
      <span><b>${totalCitations}</b>citations cumulées</span>
    `;

    // sidebar
    coreStripEl.innerHTML = years.map((y, i) => `
      <div class="core-tick${i === 0 ? ' is-active' : ''}" data-year="${escapeHtml(y)}">
        <span class="core-dot"></span>
        <a href="#year-${escapeHtml(y)}">${escapeHtml(y)}</a>
      </div>
    `).join('');

    // main content
    contentEl.innerHTML = years.map(year => {
      const entries = byYear.get(year).slice().sort((a, b) =>
        String(a.Title ?? '').localeCompare(String(b.Title ?? ''))
      );

      const entriesHtml = entries.map(r => {
        const citations = parseInt(r.Citations, 10) || 0;
        const doiLink = buildDoiLink(r.DOI);
        return `
          <article class="entry">
            <h3 class="entry-title">${escapeHtml(r.Title)}</h3>
            <p class="entry-authors">${highlightCompanyAuthors(r.Authors, r.company_Authors)}</p>
            ${r.Journal ? `<p class="entry-journal">${escapeHtml(r.Journal)}</p>` : ''}
            <div class="entry-meta">
              ${r.Type ? `<span class="tag">${escapeHtml(r.Type)}</span>` : ''}
              ${doiLink}
              ${citations > 0 ? `<span class="citation-badge">${citations} citation${citations > 1 ? 's' : ''}</span>` : ''}
            </div>
          </article>
        `;
      }).join('');

      return `
        <section class="year-section" id="year-${escapeHtml(year)}">
          <div class="year-heading">
            <span class="num">${escapeHtml(year)}</span>
            <span class="rule"></span>
            <span class="count">${entries.length} publication${entries.length > 1 ? 's' : ''}</span>
          </div>
          ${entriesHtml}
        </section>
      `;
    }).join('');

    setupScrollSpy(years);
  }

  function setupScrollSpy(years){
    const sections = years.map(y => document.getElementById(`year-${y}`)).filter(Boolean);
    const ticks = Array.from(document.querySelectorAll('.core-tick'));

    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const year = entry.target.id.replace('year-', '');
          ticks.forEach(t => t.classList.toggle('is-active', t.dataset.year === year));
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
    render(rows);
  } catch (err) {
    console.error(err);
    renderEmpty(
      `Impossible de charger <code>${escapeHtml(DATA_URL)}</code>.`,
      `Place le fichier <code>publis.xlsx</code> dans le même dossier que cette page, et ouvre la page via un serveur local ou GitHub Pages (le chargement direct en <code>file://</code> est bloqué par le navigateur).`
    );
  }
})();