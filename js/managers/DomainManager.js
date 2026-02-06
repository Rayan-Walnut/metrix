export default class DomainManager {
  constructor(initializeCharts) {
    this.initializeCharts = initializeCharts;
  }

  toggleDomainSection(btn) {
    const domainSection = btn.closest('.domain-section');
    const clausesList = domainSection?.querySelector('.clauses-list');
    if (!clausesList) return;

    const isCollapsed = clausesList.classList.contains('is-collapsed');
    clausesList.classList.toggle('is-collapsed');
    clausesList.style.display = isCollapsed ? 'block' : 'none';

    btn.classList.toggle('expanded', isCollapsed);
    const label = isCollapsed ? 'Masquer les clauses' : 'Voir les clauses';
    if (btn.childNodes[0]) btn.childNodes[0].textContent = label;

    if (isCollapsed && typeof this.initializeCharts === 'function') {
      this.initializeCharts(clausesList);
    }
  }
}
