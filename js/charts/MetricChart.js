export default class MetricChart {
  constructor(metriqueId, chartData) {
    this.metriqueId = metriqueId;
    this.chartData = chartData;
    this.chart = null;
  }

  init() {
    if (!this.chartData?.length) return;

    const canvas = document.getElementById(`chart-${this.metriqueId}`);
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const isRecent = (dateStr) => {
      const valueDate = new Date(dateStr + '-01');
      const now = new Date();
      const diffDays = (now - valueDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 20;
    };

    const labels = this.chartData.map(v => this.formatDate(v.date));
    const values = this.chartData.map(v => v.value);
    const pointColors = this.chartData.map(v => {
      if (v.value === null) return 'transparent';
      return isRecent(v.date) ? '#3b82f6' : '#F2AE2E';
    });

    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
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
          pointStyle: (c) => (c.raw === null ? false : 'circle'),
          spanGaps: true
        }]
      },
      options: this.getChartOptions()
    });
  }

  formatDate(dateStr) {
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
  }

  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            title: (context) => {
              const i = context[0].dataIndex;
              const dateStr = this.chartData[i].date;
              const date = new Date(dateStr + '-01');
              return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
            },
            label: (context) => {
              const data = this.chartData[context.dataIndex];
              if (data.count === 0) return 'Aucune donnée';
              return `Moyenne: ${data.value}`;
            },
            afterLabel: (context) => {
              const data = this.chartData[context.dataIndex];
              if (data.count === 0) return '';
              const lines = [`${data.count} valeur${data.count > 1 ? 's' : ''}`];
              if (data.lastValue !== null && data.count > 1) {
                lines.push(`Dernière: ${data.lastValue} (${data.lastDate})`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true },
        x: { grid: { display: false } }
      }
    };
  }
}
