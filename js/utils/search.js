/**
 * Fonction de recherche de clauses en temps réel
 */
function initClauseSearch() {
    const searchInput = document.getElementById('clause-search');
    const resultsCount = document.getElementById('search-results-count');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim().toLowerCase();
            filterClauses(query, resultsCount);
        }, 150);
    });

    // Permettre de vider la recherche avec Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            filterClauses('', resultsCount);
        }
    });
}

function filterClauses(query, resultsCount) {
    const allClauses = document.querySelectorAll('.clause-row');
    const allDomains = document.querySelectorAll('.domain-section');
    let matchCount = 0;

    // Si pas de recherche, tout afficher
    if (!query) {
        allClauses.forEach(clause => {
            clause.classList.remove('search-hidden');
        });
        allDomains.forEach(domain => {
            domain.classList.remove('search-hidden');
        });
        if (resultsCount) {
            resultsCount.classList.remove('visible');
        }
        return;
    }

    // Filtrer les clauses par nom OU par ID numérique
    allClauses.forEach(clause => {
        const clauseName = clause.dataset.clauseId || '';
        const clauseNum = clause.dataset.clauseNum || '';
        const matches = clauseName.includes(query) || clauseNum.includes(query);
        clause.classList.toggle('search-hidden', !matches);
        if (matches) matchCount++;
    });

    // Masquer les domaines vides
    allDomains.forEach(domain => {
        const clausesList = domain.querySelector('.clauses-list');
        const visibleClauses = clausesList ? clausesList.querySelectorAll('.clause-row:not(.search-hidden)') : [];
        const hasVisible = visibleClauses.length > 0;
        domain.classList.toggle('search-hidden', !hasVisible);

        // Ouvrir automatiquement les domaines qui ont des résultats
        if (hasVisible && clausesList && clausesList.classList.contains('is-collapsed')) {
            clausesList.classList.remove('is-collapsed');
            clausesList.style.display = 'block';
            const toggleBtn = domain.querySelector('.domain-toggle-btn');
            if (toggleBtn) {
                toggleBtn.classList.add('expanded');
                toggleBtn.childNodes[0].textContent = 'Masquer les clauses';
            }
            // Initialiser les charts du domaine ouvert
            if (window.metrixApp) {
                window.metrixApp.initializeCharts(clausesList);
            }
        }
    });

    // Afficher le compteur de résultats
    if (resultsCount) {
        resultsCount.textContent = `${matchCount} résultat${matchCount > 1 ? 's' : ''}`;
        resultsCount.classList.add('visible');
    }
}

/**
 * Fonction de recherche dans le sommaire (sidebar)
 */
function initSidebarSearch() {
    const searchInput = document.getElementById('sidebar-search-input');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim().toLowerCase();
            filterSidebarClauses(query);
        }, 150);
    });

    // Permettre de vider la recherche avec Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            filterSidebarClauses('');
        }
    });
}

function filterSidebarClauses(query) {
    const allClauses = document.querySelectorAll('.sidebar-clause-link');
    const allDomains = document.querySelectorAll('.sidebar-domain');

    // Si pas de recherche, tout afficher
    if (!query) {
        allClauses.forEach(clause => clause.classList.remove('sidebar-search-hidden'));
        allDomains.forEach(domain => {
            domain.classList.remove('sidebar-search-hidden');
            // Refermer les domaines si besoin
            const clausesList = domain.querySelector('.sidebar-clauses');
            if (clausesList) clausesList.style.display = 'none';
            const icon = domain.querySelector('.sidebar-domain-icon');
            if (icon) icon.classList.remove('expanded');
        });
        return;
    }

    // Filtrer les clauses
    allClauses.forEach(clause => {
        const clauseText = clause.textContent.toLowerCase();
        const clauseId = clause.dataset.clauseId || '';
        const matches = clauseText.includes(query) || clauseId.toLowerCase().includes(query);
        clause.classList.toggle('sidebar-search-hidden', !matches);
    });

    // Masquer les domaines vides et ouvrir ceux avec résultats
    allDomains.forEach(domain => {
        const clausesList = domain.querySelector('.sidebar-clauses');
        const visibleClauses = clausesList ? clausesList.querySelectorAll('.sidebar-clause-link:not(.sidebar-search-hidden)') : [];
        const hasVisible = visibleClauses.length > 0;
        domain.classList.toggle('sidebar-search-hidden', !hasVisible);

        // Ouvrir automatiquement les domaines qui ont des résultats
        if (hasVisible && clausesList) {
            clausesList.style.display = 'block';
            const icon = domain.querySelector('.sidebar-domain-icon');
            if (icon) icon.classList.add('expanded');
        }
    });
}


