/**
 * Classe Clause
 * Gère toutes les opérations sur la clause
 * via des requêtes AJAX fetch
 */

class Clause {
    // Méthode de insertation d'une nouvelle clause
    // prend en paramétre le bouton d'insertion et les données de la clause
    sendInsert(endpoint, data, btn) {
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

// Export ESM
export default Clause;