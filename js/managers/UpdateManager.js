/**
 * Classe UpdateManager
 * Gère toutes les opérations de mise à jour (métriques et observations)
 * via des requêtes AJAX fetch
 */
class UpdateManager {
    /**
     * Met à jour la valeur d'une métrique
     */
    updateMetricValue(btn, metriqueId) {
        const input = btn.parentElement.querySelector('.metric-value-input');
        const newValue = input.value;
        
        // Validation
        if (newValue === '' || isNaN(newValue)) {
            alert('Veuillez entrer une valeur valide');
            return;
        }
        
        const data = {
            metrique_id: metriqueId,
            value: newValue
        };
        
        this.sendUpdate('api/update_metric.php', data, btn);
    }

    /**
     * Met à jour une observation
     */
    updateObservation(btn, observationId) {
        const container = btn.closest('.observation-editor');
        const textarea = container.querySelector('.observation-input');
        const notePicker = container.querySelector('.note-color-picker');
        const activeNote = notePicker ? notePicker.querySelector('.note-color-btn.active') : null;
        const newObservation = textarea.value;
        
        // Validation
        if (newObservation.trim() === '') {
            alert('Veuillez entrer une observation');
            return;
        }
        
        const data = {
            observation_id: observationId,
            observation: newObservation,
            note: activeNote ? activeNote.dataset.value : null
        };
        
        this.sendUpdate('api/update_observation.php', data, btn);
    }

    /**
     * Envoie une requête de mise à jour au serveur
     * Méthode générique utilisée par updateMetricValue et updateObservation
     */
    sendUpdate(endpoint, data, btn) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        btn.disabled = true;
        btn.textContent = '...';

        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Affiche un indicateur de succès
                btn.textContent = '✓';
                btn.style.color = '#16a34a';
                setTimeout(() => {
                    btn.style.color = '';
                    btn.disabled = false;
                }, 2000);
            } else {
                // Affiche le message d'erreur du serveur
                alert('Erreur: ' + result.message);
                btn.textContent = '✓';
                btn.disabled = false;
            }
        })
        .catch(err => {
            // Affiche les erreurs réseau
            alert('Erreur réseau: ' + err);
            btn.textContent = '✓';
            btn.disabled = false;
        });
    }
}
