/**
 * Fonction globale pour toggler le copyright
 * Affiche/cache le texte du copyright avec une animation
 */
window.toggleCopyright = function(btn) {
    const text = btn.querySelector('.copyright-text');
    if (text) {
        text.style.animation = 'none';
        setTimeout(() => {
            text.style.animation = '';
        }, 10);
    }
};

/**
 * ========================================
 * SIDEBAR / SOMMAIRE NAVIGATION
 * ========================================
 */

/**
 * Toggle le sidebar (ouvrir/fermer)
 */
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    const isCollapsed = sidebar.classList.toggle('is-collapsed');
    
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    if (openBtn) {
        openBtn.style.display = isCollapsed ? 'block' : 'none';
    }
    
    // Sauvegarder l'état
    localStorage.setItem('sidebar-collapsed', isCollapsed);
};

/**
 * Définir le mode de position du sidebar (left, center, right)
 */
window.setSidebarMode = function(mode) {
    // Enlever les anciennes classes
    document.body.classList.remove('sidebar-left', 'sidebar-center', 'sidebar-right');
    
    // Ajouter la nouvelle classe
    if (mode !== 'left') {
        document.body.classList.add('sidebar-' + mode);
    }
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.sidebar-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Sauvegarder le mode
    localStorage.setItem('sidebar-mode', mode);
};

/**
 * Toggle un domaine dans le sidebar
 */
window.toggleSidebarDomain = function(btn) {
    const clausesContainer = btn.nextElementSibling;
    const isExpanded = btn.classList.toggle('is-expanded');
    clausesContainer.style.display = isExpanded ? 'block' : 'none';
};

/**
 * Naviguer vers une clause depuis le sidebar
 */
window.navigateToClause = function(clauseId, domainId) {
    // Ouvrir le domaine si fermé
    const domainSection = document.querySelector(`.domain-section[data-domain-id="${domainId}"]`);
    if (domainSection) {
        const clausesList = domainSection.querySelector('.clauses-list');
        if (clausesList && clausesList.classList.contains('is-collapsed')) {
            const toggleBtn = domainSection.querySelector('.domain-toggle-btn');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
    }
    
    // Scroll vers la clause
    const clauseElement = document.getElementById(`clause-${clauseId}`);
    if (clauseElement) {
        clauseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Highlight temporaire
        clauseElement.classList.add('clause-highlight');
        setTimeout(() => {
            clauseElement.classList.remove('clause-highlight');
        }, 2000);
    }
    
    // Mettre à jour le lien actif
    document.querySelectorAll('.sidebar-clause-link').forEach(link => {
        link.classList.remove('is-active');
    });
    const activeLink = document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`);
    if (activeLink) {
        activeLink.classList.add('is-active');
    }
};

/**
 * Initialiser le sidebar au chargement
 */
window.initSidebar = function() {
    // Restaurer le mode du sidebar
    const savedMode = localStorage.getItem('sidebar-mode') || 'left';
    
    if (savedMode !== 'left') {
        setSidebarMode(savedMode);
    } else {
        // Mettre à jour le bouton actif pour le mode gauche
        document.querySelectorAll('.sidebar-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === 'left');
        });
    }
    
    // Restaurer l'état collapsed
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('sidebar-open-btn');
        sidebar.classList.add('is-collapsed');
        document.body.classList.add('sidebar-collapsed');
        if (openBtn) openBtn.style.display = 'block';
    }
    
    // Ajouter les event listeners sur les liens de clauses
    document.querySelectorAll('.sidebar-clause-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const clauseId = this.dataset.clauseId;
            const domainBtn = this.closest('.sidebar-domain').querySelector('.sidebar-domain-btn');
            const domainId = domainBtn ? domainBtn.dataset.domainId : null;
            navigateToClause(clauseId, domainId);
        });
    });
    
    // Ouvrir automatiquement le premier domaine dans le sidebar
    const firstDomainBtn = document.querySelector('.sidebar-domain-btn');
    if (firstDomainBtn && !firstDomainBtn.classList.contains('is-expanded')) {
        toggleSidebarDomain(firstDomainBtn);
    }
};

/**
 * Fonction globale pour toggler l'historique des observations
 */
window.toggleObservationHistory = function(btn) {
    const historyContainer = btn.closest('.observation-history-toggle').nextElementSibling;
    const isVisible = historyContainer.style.display !== 'none';
    
    historyContainer.style.display = isVisible ? 'none' : 'flex';
    btn.classList.toggle('expanded');
    
    // Initialiser la timeline si elle n'est pas encore initialisée
    if (!isVisible) {
        const canvas = historyContainer.querySelector('canvas[id^="timeline-"]');
        if (canvas && !Chart.getChart(canvas)) {
            const timelineId = canvas.id;
            const clauseId = timelineId.replace('timeline-', '');
            const timelineDataScript = document.querySelector(`script[data-timeline-id="${clauseId}"]`);
            if (timelineDataScript && timelineDataScript.textContent) {
                try {
                    const timelineData = JSON.parse(timelineDataScript.textContent);
                    if (Array.isArray(timelineData) && timelineData.length > 0) {
                        const timeline = new ObservationTimeline(clauseId, timelineData);
                        timeline.init();
                    }
                } catch (err) {
                    console.error(`Erreur initialisation timeline au toggle:`, err);
                }
            }
        }
    }
};

/**
 * ========================================
 * BACK TO TOP BUTTON
 * ========================================
 */
window.initBackToTop = function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Action au clic
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

/**
 * ========================================
 * FAVORIS
 * ========================================
 */

/**
 * Navigue vers une clause en ouvrant le domaine si nécessaire
 */
window.goToClause = function(event, clauseId) {
    event.preventDefault();
    
    const clauseRow = document.getElementById('clause-' + clauseId);
    if (!clauseRow) return;
    
    // Trouver le domaine parent
    const domainSection = clauseRow.closest('.domain-section');
    if (domainSection) {
        const clausesList = domainSection.querySelector('.clauses-list');
        const toggleBtn = domainSection.querySelector('.domain-toggle-btn');
        
        // Si le domaine est masqué, l'ouvrir
        if (clausesList && clausesList.classList.contains('is-collapsed')) {
            clausesList.classList.remove('is-collapsed');
            clausesList.style.display = 'block';
            
            if (toggleBtn) {
                toggleBtn.classList.add('expanded');
                toggleBtn.childNodes[0].textContent = 'Masquer les clauses';
            }
            
            // Initialiser les charts si nécessaire
            if (window.metrixApp) {
                window.metrixApp.initializeCharts(clausesList);
            }
        }
    }
    
    // Scroll vers la clause avec un petit délai pour laisser le temps à l'animation
    setTimeout(() => {
        clauseRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight temporaire
        clauseRow.classList.add('highlight-clause');
        setTimeout(() => clauseRow.classList.remove('highlight-clause'), 2000);
    }, 100);
};

/**
 * Récupère les favoris depuis localStorage
 */
function getFavorites() {
    const stored = localStorage.getItem('metrix-favorites');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Sauvegarde les favoris dans localStorage
 */
function saveFavorites(favorites) {
    localStorage.setItem('metrix-favorites', JSON.stringify(favorites));
}

/**
 * Toggle le favori d'une clause
 */
window.toggleFavorite = function(event, clauseId) {
    event.preventDefault();
    event.stopPropagation();
    
    const favorites = getFavorites();
    const index = favorites.indexOf(clauseId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(clauseId);
    }
    
    saveFavorites(favorites);
    updateFavoriteUI(clauseId, index === -1);
    sortFavoritesInSidebar();
    renderFavoritesSection();
    renderSidebarFavorites();
};

/**
 * Met à jour l'UI d'un favori
 */
function updateFavoriteUI(clauseId, isFavorite) {
    // Sidebar
    const link = document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`);
    if (link) {
        const sidebarBtn = link.querySelector('.sidebar-favorite-btn');
        if (sidebarBtn) {
            sidebarBtn.classList.toggle('is-favorite', isFavorite);
            sidebarBtn.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
        }
        link.classList.toggle('is-favorite', isFavorite);
    }
    
    // Vue principale
    const mainBtn = document.querySelector(`.clause-favorite-btn[data-clause-id="${clauseId}"]`);
    if (mainBtn) {
        mainBtn.classList.toggle('is-favorite', isFavorite);
        mainBtn.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
    }
}

/**
 * Trie les clauses dans le sidebar pour mettre les favoris en premier
 */
function sortFavoritesInSidebar() {
    const favorites = getFavorites();
    
    document.querySelectorAll('.sidebar-clauses').forEach(container => {
        const links = Array.from(container.querySelectorAll('.sidebar-clause-link'));
        
        links.sort((a, b) => {
            const aFav = favorites.includes(a.dataset.clauseId);
            const bFav = favorites.includes(b.dataset.clauseId);
            
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });
        
        links.forEach(link => container.appendChild(link));
    });
}

/**
 * Rend la section des favoris dans la vue principale
 */
function renderFavoritesSection() {
    const favorites = getFavorites();
    const section = document.getElementById('favorites-section');
    const list = document.getElementById('favorites-list');
    const count = document.getElementById('favorites-count');
    
    if (!section || !list) return;
    
    // Afficher/masquer la section
    section.style.display = favorites.length > 0 ? 'block' : 'none';
    
    // Mettre à jour le compteur
    if (count) count.textContent = favorites.length;
    
    // Vider la liste
    list.innerHTML = '';
    
    if (favorites.length === 0) {
        list.innerHTML = '<span class="favorites-empty">Aucun favori</span>';
        return;
    }
    
    // Récupérer les noms des clauses depuis le DOM
    favorites.forEach(clauseId => {
        const clauseRow = document.getElementById('clause-' + clauseId);
        if (!clauseRow) return;
        
        const clauseCode = clauseRow.querySelector('.clause-code');
        const clauseName = clauseCode ? clauseCode.textContent.trim() : clauseId;
        
        const chip = document.createElement('div');
        chip.className = 'favorite-chip';
        chip.innerHTML = `
            <a href="#clause-${clauseId}" onclick="goToClause(event, '${clauseId}')" style="text-decoration: none; color: inherit;">${clauseName}</a>
            <button class="favorite-chip-remove" onclick="toggleFavorite(event, '${clauseId}')" title="Retirer des favoris">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        list.appendChild(chip);
    });
}

/**
 * Rend la section des favoris dans le sidebar (sommaire)
 */
function renderSidebarFavorites() {
    const favorites = getFavorites();
    const section = document.getElementById('sidebar-favorites');
    const list = document.getElementById('sidebar-favorites-list');
    const count = document.getElementById('sidebar-favorites-count');
    
    if (!section || !list) return;
    
    // Afficher/masquer la section
    section.style.display = favorites.length > 0 ? 'block' : 'none';
    
    // Mettre à jour le compteur
    if (count) count.textContent = favorites.length;
    
    // Vider la liste
    list.innerHTML = '';
    
    // Récupérer les noms des clauses depuis le DOM
    favorites.forEach(clauseId => {
        const clauseRow = document.getElementById('clause-' + clauseId);
        if (!clauseRow) return;
        
        const clauseCode = clauseRow.querySelector('.clause-code');
        const clauseName = clauseCode ? clauseCode.textContent.trim() : clauseId;
        
        // Récupérer la note si disponible
        const sidebarLink = document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`);
        const noteDot = sidebarLink ? sidebarLink.querySelector('.sidebar-clause-dot') : null;
        let noteClass = '';
        if (noteDot) {
            if (noteDot.classList.contains('note-low')) noteClass = 'note-low';
            else if (noteDot.classList.contains('note-mid')) noteClass = 'note-mid';
            else if (noteDot.classList.contains('note-high')) noteClass = 'note-high';
        }
        
        const link = document.createElement('a');
        link.href = '#clause-' + clauseId;
        link.className = 'sidebar-clause-link';
        link.dataset.clauseId = clauseId;
        link.onclick = (e) => goToClause(e, clauseId);
        link.innerHTML = `
            <span class="sidebar-clause-name">${clauseName}</span>
            ${noteClass ? `<span class="sidebar-clause-dot ${noteClass}"></span>` : ''}
        `;
        list.appendChild(link);
    });
}

/**
 * Initialise les favoris au chargement
 */
window.initFavorites = function() {
    const favorites = getFavorites();
    
    favorites.forEach(clauseId => {
        updateFavoriteUI(clauseId, true);
    });
    
    sortFavoritesInSidebar();
    renderFavoritesSection();
    renderSidebarFavorites();
};
