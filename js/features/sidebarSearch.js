export function initSidebarSearch() {
  const searchInput = document.getElementById('sidebar-search-input');
  if (!searchInput) return;

  let t;
  searchInput.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      filterSidebarClauses(query);
    }, 150);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterSidebarClauses('');
    }
  });
}

function filterSidebarClauses(query) {
  const allClauses = document.querySelectorAll('.sidebar-clause-link');
  const allDomains = document.querySelectorAll('.sidebar-domain');

  if (!query) {
    allClauses.forEach(c => c.classList.remove('sidebar-search-hidden'));
    allDomains.forEach(domain => {
      domain.classList.remove('sidebar-search-hidden');
      const clausesList = domain.querySelector('.sidebar-clauses');
      if (clausesList) clausesList.style.display = 'none';
      domain.querySelector('.sidebar-domain-icon')?.classList.remove('expanded');
    });
    return;
  }

  allClauses.forEach(clause => {
    const text = clause.textContent.toLowerCase();
    const id = clause.dataset.clauseId || '';
    const matches = text.includes(query) || id.toLowerCase().includes(query);
    clause.classList.toggle('sidebar-search-hidden', !matches);
  });

  allDomains.forEach(domain => {
    const clausesList = domain.querySelector('.sidebar-clauses');
    const visible = clausesList ? clausesList.querySelectorAll('.sidebar-clause-link:not(.sidebar-search-hidden)') : [];
    const hasVisible = visible.length > 0;
    domain.classList.toggle('sidebar-search-hidden', !hasVisible);

    if (hasVisible && clausesList) {
      clausesList.style.display = 'block';
      domain.querySelector('.sidebar-domain-icon')?.classList.add('expanded');
    }
  });
}
