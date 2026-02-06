export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const openBtn = document.getElementById('sidebar-open-btn');
  if (!sidebar) return;

  const isCollapsed = sidebar.classList.toggle('is-collapsed');
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);

  if (openBtn) openBtn.style.display = isCollapsed ? 'block' : 'none';
  localStorage.setItem('sidebar-collapsed', String(isCollapsed));
}

export function setSidebarMode(mode) {
  document.body.classList.remove('sidebar-left', 'sidebar-center', 'sidebar-right');
  if (mode !== 'left') document.body.classList.add('sidebar-' + mode);

  document.querySelectorAll('.sidebar-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  localStorage.setItem('sidebar-mode', mode);
}

export function toggleSidebarDomain(btn) {
  const clausesContainer = btn.nextElementSibling;
  const isExpanded = btn.classList.toggle('is-expanded');
  if (clausesContainer) clausesContainer.style.display = isExpanded ? 'block' : 'none';
}

export function navigateToClause(clauseId, domainId) {
  const domainSection = document.querySelector(`.domain-section[data-domain-id="${domainId}"]`);
  if (domainSection) {
    const clausesList = domainSection.querySelector('.clauses-list');
    if (clausesList && clausesList.classList.contains('is-collapsed')) {
      domainSection.querySelector('.domain-toggle-btn')?.click();
    }
  }

  const clauseElement = document.getElementById(`clause-${clauseId}`);
  if (!clauseElement) return;

  clauseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  clauseElement.classList.add('clause-highlight');
  setTimeout(() => clauseElement.classList.remove('clause-highlight'), 2000);

  document.querySelectorAll('.sidebar-clause-link').forEach(link => link.classList.remove('is-active'));
  document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`)?.classList.add('is-active');
}

export function initSidebar() {
  const savedMode = localStorage.getItem('sidebar-mode') || 'left';
  setSidebarMode(savedMode);

  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    sidebar?.classList.add('is-collapsed');
    document.body.classList.add('sidebar-collapsed');
    if (openBtn) openBtn.style.display = 'block';
  }

  document.querySelectorAll('.sidebar-clause-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const clauseId = link.dataset.clauseId;
      const domainBtn = link.closest('.sidebar-domain')?.querySelector('.sidebar-domain-btn');
      const domainId = domainBtn?.dataset.domainId;
      navigateToClause(clauseId, domainId);
    });
  });

  const firstDomainBtn = document.querySelector('.sidebar-domain-btn');
  if (firstDomainBtn && !firstDomainBtn.classList.contains('is-expanded')) {
    toggleSidebarDomain(firstDomainBtn);
  }
}
