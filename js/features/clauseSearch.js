export function initClauseSearch() {
  const searchInput = document.getElementById('clause-search');
  const resultsCount = document.getElementById('search-results-count');
  if (!searchInput) return;

  let t;
  searchInput.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      filterClauses(query, resultsCount);
    }, 150);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterClauses('', resultsCount);
    }
  });
}

function filterClauses(query, resultsCount) {
  const allClauses = document.querySelectorAll('.clause-row');
  const allDomains = document.querySelectorAll('.domain-section');
  let matchCount = 0;

  if (!query) {
    allClauses.forEach(c => c.classList.remove('search-hidden'));
    allDomains.forEach(d => d.classList.remove('search-hidden'));
    resultsCount?.classList.remove('visible');
    return;
  }

  allClauses.forEach(clause => {
    const clauseName = clause.dataset.clauseId || '';
    const clauseNum = clause.dataset.clauseNum || '';
    const matches = clauseName.includes(query) || clauseNum.includes(query);
    clause.classList.toggle('search-hidden', !matches);
    if (matches) matchCount++;
  });

  allDomains.forEach(domain => {
    const clausesList = domain.querySelector('.clauses-list');
    const visibleClauses = clausesList ? clausesList.querySelectorAll('.clause-row:not(.search-hidden)') : [];
    const hasVisible = visibleClauses.length > 0;
    domain.classList.toggle('search-hidden', !hasVisible);

    if (hasVisible && clausesList && clausesList.classList.contains('is-collapsed')) {
      clausesList.classList.remove('is-collapsed');
      clausesList.style.display = 'block';

      const toggleBtn = domain.querySelector('.domain-toggle-btn');
      if (toggleBtn) {
        toggleBtn.classList.add('expanded');
        toggleBtn.childNodes[0].textContent = 'Masquer les clauses';
      }

      window.metrixApp?.initializeCharts(clausesList);
    }
  });

  if (resultsCount) {
    resultsCount.textContent = `${matchCount} résultat${matchCount > 1 ? 's' : ''}`;
    resultsCount.classList.add('visible');
  }
}
