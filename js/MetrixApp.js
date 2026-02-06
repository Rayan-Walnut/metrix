/**
 * Classe MetrixApp
 * Classe principale de l'application
 * Orchestre l'initialisation de tous les composants
 */
class MetrixApp {
    constructor() {
        this.updateManager = new UpdateManager();
        this.clause = new Clause();
        window.metrixApp = this;
        this.init();
    }

    /**
     * Initialise l'application
     */
    init() {
        this.attachGlobalFunctions();
        this.initializeVisibleCharts();
    }

    /**
     * Expose les fonctions de mise à jour au scope global (window)
     * Permet l'utilisation dans les attributs onclick du HTML
     */
    attachGlobalFunctions() {
        window.updateMetricValue = (btn, metriqueId) => {
            this.updateManager.updateMetricValue(btn, metriqueId);
        };

        window.updateObservation = (btn, observationId) => {
            this.updateManager.updateObservation(btn, observationId);
        };

        window.clause = (btn, clauseId) => {
            this.clause.sendInsert('api/add_clause.php', { clause_id: clauseId }, btn);
        };

        window.uploadPreuve = (btn, clauseId) => {
            this.uploadPreuve(btn, clauseId);
        };

        window.deletePreuve = (btn, preuveId) => {
            this.deletePreuve(btn, preuveId);
        };

        window.deleteAllPreuves = (btn, clauseId) => {
            this.deleteAllPreuves(btn, clauseId);
        };

        window.renamePreuve = (btn, preuveId) => {
            this.renamePreuve(btn, preuveId);
        };

        window.toggleDomainSection = (btn) => {
            const domainSection = btn.closest('.domain-section');
            const clausesList = domainSection ? domainSection.querySelector('.clauses-list') : null;
            if (!clausesList) {
                return;
            }

            const isCollapsed = clausesList.classList.contains('is-collapsed');
            clausesList.classList.toggle('is-collapsed');
            clausesList.style.display = isCollapsed ? 'block' : 'none';
            btn.classList.toggle('expanded', isCollapsed);
            btn.childNodes[0].textContent = isCollapsed ? 'Masquer les clauses' : 'Voir les clauses';

            if (isCollapsed) {
                this.initializeCharts(clausesList);
            }
        };
    }

    /**
     * Initialise les graphiques de la page
     * Récupère les données Chart.js depuis le HTML et crée les instances
     */
    initializeVisibleCharts() {
        document.querySelectorAll('.clauses-list').forEach(container => {
            const isHidden = container.classList.contains('is-collapsed') || container.style.display === 'none';
            if (!isHidden) {
                this.initializeCharts(container);
            }
        });
    }

    initializeCharts(rootElement = document) {
        // D'abord détruire les charts existants de manière sécurisée dans le périmètre
        rootElement.querySelectorAll('canvas[id^="chart-"]').forEach(canvas => {
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
                existingChart.destroy();
            }
        });

        // Détruire aussi les timelines dans le périmètre
        rootElement.querySelectorAll('canvas[id^="timeline-"]').forEach(canvas => {
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
                existingChart.destroy();
            }
        });

        // Créer les nouveaux charts métriques
        rootElement.querySelectorAll('canvas[id^="chart-"]').forEach(canvas => {
            const chartId = canvas.id;
            const metriqueId = chartId.replace('chart-', '');
            
            // Récupère les données Chart.js depuis l'attribut data du canvas
            const chartDataScript = document.querySelector(`script[data-chart-id="${metriqueId}"]`);
            if (chartDataScript && chartDataScript.textContent) {
                try {
                    const chartData = JSON.parse(chartDataScript.textContent);
                    if (Array.isArray(chartData) && chartData.length > 0) {
                        const metricChart = new MetricChart(metriqueId, chartData);
                        metricChart.init();
                    }
                } catch (err) {
                    console.error(`Erreur initialisation graphique ${metriqueId}:`, err);
                }
            }
        });

        // Créer les nouvelles timelines d'observations
        rootElement.querySelectorAll('canvas[id^="timeline-"]').forEach(canvas => {
            const timelineId = canvas.id;
            const clauseId = timelineId.replace('timeline-', '');
            
            // Récupère les données timeline depuis le script JSON
            const timelineDataScript = document.querySelector(`script[data-timeline-id="${clauseId}"]`);
            if (timelineDataScript && timelineDataScript.textContent) {
                try {
                    const timelineData = JSON.parse(timelineDataScript.textContent);
                    if (Array.isArray(timelineData) && timelineData.length > 0) {
                        const timeline = new ObservationTimeline(clauseId, timelineData);
                        timeline.init();
                    }
                } catch (err) {
                    console.error(`Erreur initialisation timeline ${clauseId}:`, err);
                }
            }
        });
    }

    /**
     * Upload une ou plusieurs preuves pour une clause
     */
    uploadPreuve(btn, clauseId) {
        const container = btn.closest('.preuve-container');
        const uploadDiv = btn.closest('.preuve-upload');
        const fileInput = uploadDiv.querySelector('.preuve-input');
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Veuillez sélectionner un ou plusieurs fichiers');
            return;
        }

        const files = Array.from(fileInput.files);
        btn.disabled = true;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '...';

        // Upload tous les fichiers séquentiellement
        this.uploadFilesSequentially(files, clauseId, container, uploadDiv, btn, originalHTML, 0);
    }

    /**
     * Upload les fichiers un par un
     */
    uploadFilesSequentially(files, clauseId, container, uploadDiv, btn, originalHTML, index) {
        const self = this; // Garder la référence à this
        
        if (index >= files.length) {
            // Tous les fichiers sont uploadés
            const fileInput = uploadDiv.querySelector('.preuve-input');
            fileInput.value = '';
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            return;
        }

        const file = files[index];
        const formData = new FormData();
        formData.append('clause_id', clauseId);
        formData.append('preuve', file);

        btn.innerHTML = `${index + 1}/${files.length}`;

        fetch('api/upload_preuve.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log('Upload result:', result); // Debug
            if (result.success) {
                // Ajouter la nouvelle preuve à la liste
                let preuvesList = container.querySelector('.preuves-list');
                console.log('preuvesList found:', preuvesList); // Debug
                
                if (!preuvesList) {
                    preuvesList = document.createElement('div');
                    preuvesList.className = 'preuves-list';
                    container.insertBefore(preuvesList, uploadDiv);
                    console.log('Created new preuvesList'); // Debug
                }
                
                const preuveItem = document.createElement('div');
                preuveItem.className = 'preuve-item';
                preuveItem.dataset.preuveId = result.preuveId;
                preuveItem.innerHTML = `
                    <a href="${result.filepath}" target="_blank" class="preuve-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span class="preuve-filename">${result.filename}</span>
                    </a>
                    <button type="button" class="preuve-rename-btn" onclick="renamePreuve(this, ${result.preuveId})" title="Renommer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <button type="button" class="preuve-delete-btn" onclick="deletePreuve(this, ${result.preuveId})" title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                preuvesList.appendChild(preuveItem);
                console.log('Added preuveItem to list'); // Debug
                
                // Mettre à jour le compteur
                self.updatePreuvesCount(container);
                
                // Upload le fichier suivant
                self.uploadFilesSequentially(files, clauseId, container, uploadDiv, btn, originalHTML, index + 1);
            } else {
                alert('Erreur pour ' + file.name + ': ' + result.message);
                // Continuer avec les autres fichiers
                self.uploadFilesSequentially(files, clauseId, container, uploadDiv, btn, originalHTML, index + 1);
            }
        })
        .catch(err => {
            alert('Erreur réseau pour ' + file.name + ': ' + err);
            // Continuer avec les autres fichiers même en cas d'erreur
            self.uploadFilesSequentially(files, clauseId, container, uploadDiv, btn, originalHTML, index + 1);
        });
    }

    /**
     * Supprime une preuve
     */
    deletePreuve(btn, preuveId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette preuve ?')) {
            return;
        }

        const preuveItem = btn.closest('.preuve-item');
        const container = btn.closest('.preuve-container');
        
        const formData = new FormData();
        formData.append('preuve_id', preuveId);

        btn.disabled = true;

        fetch('api/delete_preuve.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                preuveItem.remove();
                
                // Supprimer la liste si vide
                const preuvesList = container.querySelector('.preuves-list');
                if (preuvesList && preuvesList.children.length === 0) {
                    preuvesList.remove();
                }
                
                // Mettre à jour le compteur
                this.updatePreuvesCount(container);
            } else {
                alert('Erreur: ' + result.message);
                btn.disabled = false;
            }
        })
        .catch(err => {
            alert('Erreur réseau: ' + err);
            btn.disabled = false;
        });
    }

    /**
     * Renomme une preuve (mode édition inline)
     */
    renamePreuve(btn, preuveId) {
        const preuveItem = btn.closest('.preuve-item');
        const filenameSpan = preuveItem.querySelector('.preuve-filename');
        const currentName = filenameSpan.textContent;
        
        // Créer l'input d'édition
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'preuve-filename-input';
        input.value = currentName;
        
        // Remplacer le span par l'input
        filenameSpan.style.display = 'none';
        filenameSpan.parentNode.insertBefore(input, filenameSpan.nextSibling);
        input.focus();
        input.select();
        
        // Masquer le bouton rename, afficher les boutons save/cancel
        const renameBtn = preuveItem.querySelector('.preuve-rename-btn');
        renameBtn.style.display = 'none';
        
        // Créer les boutons de confirmation
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'preuve-rename-actions';
        actionsDiv.innerHTML = `
            <button type="button" class="preuve-rename-save" title="Valider">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
            <button type="button" class="preuve-rename-cancel" title="Annuler">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        renameBtn.parentNode.insertBefore(actionsDiv, renameBtn);
        
        const saveBtn = actionsDiv.querySelector('.preuve-rename-save');
        const cancelBtn = actionsDiv.querySelector('.preuve-rename-cancel');
        
        const cancelEdit = () => {
            input.remove();
            actionsDiv.remove();
            filenameSpan.style.display = '';
            renameBtn.style.display = '';
        };
        
        const saveEdit = () => {
            const newName = input.value.trim();
            if (!newName) {
                alert('Le nom ne peut pas être vide');
                return;
            }
            if (newName === currentName) {
                cancelEdit();
                return;
            }
            
            saveBtn.disabled = true;
            cancelBtn.disabled = true;
            
            const formData = new FormData();
            formData.append('preuve_id', preuveId);
            formData.append('filename', newName);
            
            fetch('api/rename_preuve.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    filenameSpan.textContent = newName;
                    cancelEdit();
                } else {
                    alert('Erreur: ' + result.message);
                    saveBtn.disabled = false;
                    cancelBtn.disabled = false;
                }
            })
            .catch(err => {
                alert('Erreur réseau: ' + err);
                saveBtn.disabled = false;
                cancelBtn.disabled = false;
            });
        };
        
        saveBtn.addEventListener('click', saveEdit);
        cancelBtn.addEventListener('click', cancelEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
    }

    /**
     * Met à jour le compteur de preuves
     */
    updatePreuvesCount(container) {
        const section = container.closest('.preuve-section');
        const label = section.querySelector('.content-label');
        const preuvesList = container.querySelector('.preuves-list');
        const count = preuvesList ? preuvesList.children.length : 0;
        
        let countSpan = label.querySelector('.preuves-count');
        if (count > 0) {
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.className = 'preuves-count';
                label.appendChild(countSpan);
            }
            countSpan.textContent = count;
        } else if (countSpan) {
            countSpan.remove();
        }
        
        // Gérer le bouton "Vider tout"
        const clearBtn = container.querySelector('.preuve-clear-all-btn');
        if (count > 0 && !clearBtn) {
            const uploadDiv = container.querySelector('.preuve-upload');
            const clauseId = container.dataset.clauseId;
            const newClearBtn = document.createElement('button');
            newClearBtn.type = 'button';
            newClearBtn.className = 'preuve-clear-all-btn';
            newClearBtn.title = 'Vider toutes les preuves';
            newClearBtn.onclick = function() { deleteAllPreuves(this, clauseId); };
            newClearBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Vider tout
            `;
            uploadDiv.appendChild(newClearBtn);
        } else if (count === 0 && clearBtn) {
            clearBtn.remove();
        }
    }

    /**
     * Supprime toutes les preuves d'une clause
     */
    deleteAllPreuves(btn, clauseId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer TOUTES les preuves de cette clause ?')) {
            return;
        }

        const container = btn.closest('.preuve-container');
        
        const formData = new FormData();
        formData.append('clause_id', clauseId);

        btn.disabled = true;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '...';

        fetch('api/delete_all_preuves.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Supprimer la liste des preuves
                const preuvesList = container.querySelector('.preuves-list');
                if (preuvesList) {
                    preuvesList.remove();
                }
                
                // Mettre à jour le compteur (et supprimer le bouton)
                this.updatePreuvesCount(container);
            } else {
                alert('Erreur: ' + result.message);
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        })
        .catch(err => {
            alert('Erreur réseau: ' + err);
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        });
    }
}
