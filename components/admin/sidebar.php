<!-- Sidebar Admin Navigation -->
<nav class="admin-sidebar" id="admin-sidebar">
    <div class="sidebar-brand">
        <img src="../ressources/logo.png" alt="Logo" class="brand-logo" />
        <div class="brand-text">
            <span class="brand-name">Metrix</span>
            <span class="brand-sub">ADMIN</span>
        </div>
    </div>

    <div class="admin-sidebar-header">
        <h2>Administration</h2>
        <button class="sidebar-toggle" onclick="toggleAdminSidebar()" title="Réduire le menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
    </div>

    <div class="admin-sidebar-content">
        <div class="admin-nav-section">
            <h3 class="admin-nav-title">Gestion des clauses</h3>
            <a href="ajouter-clause.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'ajouter-clause.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Ajouter une clause</span>
            </a>
            <a href="liste-clauses.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'liste-clauses.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span>Liste des clauses</span>
            </a>
            <a href="modifier-clause.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'modifier-clause.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                <span>Modifier une clause</span>
            </a>
        </div>

        <div class="admin-nav-section">
            <h3 class="admin-nav-title">Gestion des domaines</h3>
            <a href="ajouter-domaine.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'ajouter-domaine.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>Ajouter un domaine</span>
            </a>
            <a href="liste-domaines.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'liste-domaines.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Liste des domaines</span>
            </a>
        </div>

        <div class="admin-nav-section">
            <h3 class="admin-nav-title">Gestion des métriques</h3>
            <a href="ajouter-metrique.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'ajouter-metrique.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Ajouter une métrique</span>
            </a>
            <a href="liste-metriques.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'liste-metriques.php' ? 'active' : '' ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span>Liste des métriques</span>
            </a>
        </div>

        <div class="admin-nav-divider"></div>

        <div class="admin-nav-section">
            <a href="../index.php" class="admin-nav-link admin-nav-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Retour au tableau de bord</span>
            </a>
        </div>
    </div>

    <div class="admin-sidebar-footer">
        <div class="admin-user-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Administrateur</span>
        </div>
    </div>
</nav>

<!-- Bouton pour rouvrir la sidebar -->
<button class="admin-sidebar-open-btn" id="admin-sidebar-open-btn" onclick="toggleAdminSidebar()" title="Ouvrir le menu" style="display: none;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
</button>

<script>
function toggleAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const openBtn = document.getElementById('admin-sidebar-open-btn');
    const mainContent = document.querySelector('.admin-container');
    
    sidebar.classList.toggle('is-collapsed');
    document.body.classList.toggle('admin-sidebar-collapsed');
    
    if (sidebar.classList.contains('is-collapsed')) {
        openBtn.style.display = 'flex';
    } else {
        openBtn.style.display = 'none';
    }
}
</script>