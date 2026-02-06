/**
 * Classe MetricChart
 * Responsable de l'initialisation et de la configuration des graphiques Chart.js
 */
class MetricChart {
    constructor(metriqueId, chartData) {
        this.metriqueId = metriqueId;
        this.chartData = chartData;
        this.chart = null;
    }

    /**
     * Initialise le graphique Chart.js pour cette métrique
     */
    init() {
        if (!this.chartData || this.chartData.length === 0) {
            console.warn(`Aucune donnée pour la métrique ${this.metriqueId}`);
            return;
        }

        const canvasElement = document.getElementById(`chart-${this.metriqueId}`);
        if (!canvasElement) {
            console.warn(`Canvas non trouvé: chart-${this.metriqueId}`);
            return;
        }

        try {
            // Détruire le chart existant s'il y en a un
            const existingChart = Chart.getChart(`chart-${this.metriqueId}`);
            if (existingChart) {
                existingChart.destroy();
            }

            // Vérifier si une date est dans les 20 derniers jours
            const isRecent = (dateStr) => {
                const valueDate = new Date(dateStr + '-01');
                const now = new Date();
                const diffTime = now - valueDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return diffDays <= 20;
            };

            // Générer les couleurs des points en fonction de la date
            const pointColors = this.chartData.map(v => {
                if (v.value === null) return 'transparent';
                return isRecent(v.date) ? '#3b82f6' : '#F2AE2E';
            });

            const labels = this.chartData.map(v => this.formatDate(v.date));
            const values = this.chartData.map(v => v.value);
            
            const ctx = canvasElement.getContext('2d');

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Valeur',
                        data: values,
                        borderColor: '#027373',
                        backgroundColor: 'rgba(2, 115, 115, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: pointColors,
                        pointBorderColor: '#027373',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointStyle: (ctx) => {
                            return ctx.raw === null ? false : 'circle';
                        },
                        spanGaps: true
                    }]
                },
                options: this.getChartOptions()
            });
        } catch (err) {
            console.error(`Erreur création graphique ${this.metriqueId}:`, err);
        }
    }

    /**
     * Formate une date au format "MMM YY" (Jan 25)
     */
    formatDate(dateStr) {
        const date = new Date(dateStr + '-01');
        return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    }

    /**
     * Retourne les options de configuration Chart.js
     */
    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#0D1326',
                        font: { family: 'Inter, sans-serif', size: 12 }
                    }
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
                            const dateStr = this.chartData[dataIndex].date;
                            const date = new Date(dateStr + '-01');
                            return date.toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long'
                            });
                        },
                        label: (context) => {
                            const dataIndex = context.dataIndex;
                            const data = this.chartData[dataIndex];
                            if (data.count === 0) {
                                return 'Aucune donnée';
                            }
                            return `Moyenne: ${data.value}`;
                        },
                        afterLabel: (context) => {
                            const dataIndex = context.dataIndex;
                            const data = this.chartData[dataIndex];
                            if (data.count === 0) {
                                return '';
                            }
                            let lines = [`${data.count} valeur${data.count > 1 ? 's' : ''}`];
                            if (data.lastValue !== null && data.count > 1) {
                                lines.push(`Dernière: ${data.lastValue} (${data.lastDate})`);
                            }
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(2, 115, 115, 0.1)', 
                        drawBorder: false 
                    },
                    ticks: { 
                        color: '#5a6f6f', 
                        font: { size: 12 } 
                    }
                },
                x: {
                    grid: { 
                        display: false, 
                        drawBorder: false 
                    },
                    ticks: { 
                        color: '#5a6f6f', 
                        font: { size: 11 }, 
                        maxRotation: 45, 
                        minRotation: 0 
                    }
                }
            }
        };
    }
}
