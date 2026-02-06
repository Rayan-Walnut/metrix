/**
 * Classe ObservationTimeline
 * Responsable de l'affichage de la timeline visuelle des observations
 */
class ObservationTimeline {
    constructor(clauseId, timelineData) {
        this.clauseId = clauseId;
        this.timelineData = timelineData;
        this.chart = null;
    }

    /**
     * Initialise le graphique timeline Chart.js
     */
    init() {
        if (!this.timelineData || this.timelineData.length === 0) {
            console.warn(`Aucune donnée pour la timeline ${this.clauseId}`);
            return;
        }

        const canvasElement = document.getElementById(`timeline-${this.clauseId}`);
        if (!canvasElement) {
            console.warn(`Canvas non trouvé: timeline-${this.clauseId}`);
            return;
        }

        try {
            // Détruire le chart existant s'il y en a un
            const existingChart = Chart.getChart(`timeline-${this.clauseId}`);
            if (existingChart) {
                existingChart.destroy();
            }

            // Déterminer l'échelle de note (0-2 ou 1-3) pour la couleur des points
            const noteValues = this.timelineData
                .map(obs => Number(obs.note))
                .filter(val => Number.isFinite(val));
            const hasZero = noteValues.some(val => val === 0);
            const hasThree = noteValues.some(val => val === 3);
            const useZeroToTwoScale = hasZero || !hasThree;

            const getNoteColor = (note) => {
                const value = Number(note);
                if (!Number.isFinite(value)) {
                    return '#F2AE2E';
                }

                if (useZeroToTwoScale) {
                    if (value <= 0) return '#ef4444';
                    if (value === 1) return '#f59e0b';
                    return '#22c55e';
                }

                if (value <= 1) return '#ef4444';
                if (value === 2) return '#f59e0b';
                return '#22c55e';
            };

            // Créer un simple axe chronologique avec les dates
            const labels = this.timelineData.map((obs, idx) => {
                const date = new Date(obs.date);
                return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
            });

            const ctx = canvasElement.getContext('2d');

            this.chart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Observations',
                        data: this.timelineData.map((obs, idx) => ({
                            x: labels[idx],
                            y: 1
                        })),
                        backgroundColor: this.timelineData.map(obs => getNoteColor(obs.note)),
                        borderColor: '#027373',
                        borderWidth: 2,
                        pointRadius: 8,
                        pointHoverRadius: 10,
                        showLine: true,
                        borderDash: [5, 5],
                        tension: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'x',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#0D1326',
                            padding: 12,
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: '#027373',
                            borderWidth: 1,
                            callbacks: {
                                title: (context) => {
                                    const dataIndex = context[0].dataIndex;
                                    return this.timelineData[dataIndex].date;
                                },
                                label: (context) => {
                                    const obs = this.timelineData[context.dataIndex];
                                    return obs.observation.substring(0, 100) + (obs.observation.length > 100 ? '...' : '');
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            display: false,
                            beginAtZero: true,
                            max: 2
                        },
                        x: {
                            type: 'category',
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#5a6f6f',
                                font: { size: 10 }
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.error(`Erreur création timeline ${this.clauseId}:`, err);
        }
    }
}
