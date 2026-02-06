// js/main.js
import MetrixApp from './MetrixApp.js';

import { exposeGlobals } from './ui/globals-expose.js';

import { initSidebar } from './ui/sidebar.js';
import { initBackToTop } from './ui/backToTop.js';
import { initFavorites } from './ui/favorites.js';

// ✅ ils sont dans features
import { initClauseSearch } from './features/clauseSearch.js';
import { initSidebarSearch } from './features/sidebarSearch.js';
import { initMetricTooltips } from './features/tooltips.js';
import { initNoteColorPicker } from './features/noteColorPicker.js';

document.addEventListener('DOMContentLoaded', () => {
  exposeGlobals?.();

  initSidebar();
  new MetrixApp();

  initClauseSearch();
  initSidebarSearch();

  initMetricTooltips();
  initNoteColorPicker();

  initBackToTop();
  initFavorites();
});
