function getFavorites() {
  const stored = localStorage.getItem('metrix-favorites');
  return stored ? JSON.parse(stored) : [];
}
function saveFavorites(favorites) {
  localStorage.setItem('metrix-favorites', JSON.stringify(favorites));
}

function updateFavoriteUI(clauseId, isFavorite) {
  const link = document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`);
  if (link) {
    const btn = link.querySelector('.sidebar-favorite-btn');
    if (btn) {
      btn.classList.toggle('is-favorite', isFavorite);
      btn.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
    }
    link.classList.toggle('is-favorite', isFavorite);
  }

  const mainBtn = document.querySelector(`.clause-favorite-btn[data-clause-id="${clauseId}"]`);
  if (mainBtn) {
    mainBtn.classList.toggle('is-favorite', isFavorite);
    mainBtn.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
  }
}

function renderFavoritesSection() {
  const favorites = getFavorites();
  const section = document.getElementById('favorites-section');
  const list = document.getElementById('favorites-list');
  const count = document.getElementById('favorites-count');
  if (!section || !list) return;

  section.style.display = favorites.length > 0 ? 'block' : 'none';
  if (count) count.textContent = favorites.length;

  list.innerHTML = '';
  if (favorites.length === 0) {
    list.innerHTML = '<span class="favorites-empty">Aucun favori</span>';
    return;
  }

  favorites.forEach(clauseId => {
    const clauseRow = document.getElementById('clause-' + clauseId);
    if (!clauseRow) return;

    const clauseCode = clauseRow.querySelector('.clause-code');
    const clauseName = clauseCode ? clauseCode.textContent.trim() : clauseId;

    const chip = document.createElement('div');
    chip.className = 'favorite-chip';
    chip.innerHTML = `
      <a href="#clause-${clauseId}" onclick="goToClause(event, '${clauseId}')" style="text-decoration:none;color:inherit;">
        ${clauseName}
      </a>
      <button class="favorite-chip-remove" data-action="favorite-toggle" data-clause-id="${clauseId}" title="Retirer des favoris">×</button>
    `;
    list.appendChild(chip);
  });
}

function renderSidebarFavorites() {
  const favorites = getFavorites();
  const section = document.getElementById('sidebar-favorites');
  const list = document.getElementById('sidebar-favorites-list');
  const count = document.getElementById('sidebar-favorites-count');
  if (!section || !list) return;

  section.style.display = favorites.length > 0 ? 'block' : 'none';
  if (count) count.textContent = favorites.length;

  list.innerHTML = '';

  favorites.forEach(clauseId => {
    const clauseRow = document.getElementById('clause-' + clauseId);
    if (!clauseRow) return;

    const clauseCode = clauseRow.querySelector('.clause-code');
    const clauseName = clauseCode ? clauseCode.textContent.trim() : clauseId;

    const sidebarLink = document.querySelector(`.sidebar-clause-link[data-clause-id="${clauseId}"]`);
    const noteDot = sidebarLink?.querySelector('.sidebar-clause-dot');

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

export function goToClause(event, clauseId) {
  event.preventDefault();

  const clauseRow = document.getElementById('clause-' + clauseId);
  if (!clauseRow) return;

  const domainSection = clauseRow.closest('.domain-section');
  if (domainSection) {
    const clausesList = domainSection.querySelector('.clauses-list');
    const toggleBtn = domainSection.querySelector('.domain-toggle-btn');

    if (clausesList && clausesList.classList.contains('is-collapsed')) {
      clausesList.classList.remove('is-collapsed');
      clausesList.style.display = 'block';

      if (toggleBtn) {
        toggleBtn.classList.add('expanded');
        toggleBtn.childNodes[0].textContent = 'Masquer les clauses';
      }

      window.metrixApp?.initializeCharts(clausesList);
    }
  }

  setTimeout(() => {
    clauseRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clauseRow.classList.add('highlight-clause');
    setTimeout(() => clauseRow.classList.remove('highlight-clause'), 2000);
  }, 100);
}

export function toggleFavorite(event, clauseId) {
  event.preventDefault();
  event.stopPropagation();

  const favorites = getFavorites();
  const index = favorites.indexOf(clauseId);

  if (index > -1) favorites.splice(index, 1);
  else favorites.push(clauseId);

  saveFavorites(favorites);
  updateFavoriteUI(clauseId, index === -1);
  renderFavoritesSection();
  renderSidebarFavorites();
}

export function initFavorites() {
  const favorites = getFavorites();
  favorites.forEach(id => updateFavoriteUI(id, true));
  renderFavoritesSection();
  renderSidebarFavorites();
}
