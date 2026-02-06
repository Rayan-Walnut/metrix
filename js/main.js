/**
 * Point d'entrée principal de l'application Metrix
 * Initialise tous les composants quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le sidebar/sommaire
    initSidebar();
    
    // Initialiser l'application principale
    new MetrixApp();
    
    // Initialiser les recherches
    initClauseSearch();
    initSidebarSearch();
    
    // Initialiser les tooltips
    initMetricTooltips();
    
    // Initialiser les boutons de notes colorés
    initNoteColorPicker();
    
    // Initialiser le bouton retour en haut
    initBackToTop();
    
    // Initialiser les favoris
    initFavorites();
});
