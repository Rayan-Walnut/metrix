/**
 * Initialise les tooltips des métriques avec liens cliquables
 */
function initMetricTooltips() {
    document.querySelectorAll('.metric-info-icon[data-tooltip-content]').forEach(icon => {
        const tooltip = icon.querySelector('.metric-tooltip');
        const content = icon.getAttribute('data-tooltip-content');
        
        if (tooltip && content) {
            // Si le contenu contient https://, tout le contenu devient un lien
            if (content.includes('https://') || content.includes('http://')) {
                const url = content.match(/(https?:\/\/\S+)/i);
                if (url) {
                    tooltip.innerHTML = '<a href="' + url[1] + '" target="_blank" rel="noopener noreferrer">' + content + '</a>';
                } else {
                    tooltip.textContent = content;
                }
            } else {
                tooltip.textContent = content;
            }
        }
    });
}

/**
 * Initialise les boutons colorés pour les notes
 */
function initNoteColorPicker() {
    document.querySelectorAll('.note-color-picker').forEach(picker => {
        picker.querySelectorAll('.note-color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Enlever active de tous les boutons du picker
                picker.querySelectorAll('.note-color-btn').forEach(b => b.classList.remove('active'));
                // Ajouter active au bouton cliqué
                this.classList.add('active');
            });
        });
    });
}
