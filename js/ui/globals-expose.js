import { toggleCopyright } from './copyright.js';
import { toggleSidebar, setSidebarMode, toggleSidebarDomain, navigateToClause, initSidebar } from './sidebar.js';
import { toggleObservationHistory } from './observationHistory.js';
import { goToClause, toggleFavorite } from './favorites.js';

export function exposeGlobals() {
  // Copyright
  window.toggleCopyright = toggleCopyright;

  // Sidebar
  window.toggleSidebar = toggleSidebar;
  window.setSidebarMode = setSidebarMode;
  window.toggleSidebarDomain = toggleSidebarDomain;
  window.navigateToClause = navigateToClause;
  window.initSidebar = initSidebar;

  // Observations history
  window.toggleObservationHistory = toggleObservationHistory;

  // Favorites
  window.goToClause = goToClause;
  window.toggleFavorite = toggleFavorite;

  // Domain toggle (delegate to MetrixApp if available)
  window.toggleDomainSection = function (btn) {
    if (window.metrixApp && typeof window.metrixApp.toggleDomainSection === 'function') {
      return window.metrixApp.toggleDomainSection(btn);
    }
    const domainSection = btn?.closest('.domain-section');
    const clausesList = domainSection?.querySelector('.clauses-list');
    if (!clausesList) return;
    const isCollapsed = clausesList.classList.contains('is-collapsed');
    clausesList.classList.toggle('is-collapsed');
    clausesList.style.display = isCollapsed ? 'block' : 'none';
    btn.classList.toggle('expanded', isCollapsed);
    const label = isCollapsed ? 'Masquer les clauses' : 'Voir les clauses';
    if (btn.childNodes[0]) btn.childNodes[0].textContent = label;
  };
}
