export default class ObservationTimeline {
  constructor(clauseId, timelineData) {
    this.clauseId = clauseId;
    this.timelineData = timelineData;
    this.chart = null;
  }

  init() {
    if (!this.timelineData?.length) return;

    const canvas = document.getElementById(`timeline-${this.clauseId}`);
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const noteValues = this.timelineData
      .map(o => Number(o.note))
      .filter(v => Number.isFinite(v));
    const hasZero = noteValues.some(v => v === 0);
    const hasThree = noteValues.some(v => v === 3);
    const useZeroToTwoScale = hasZero || !hasThree;

    const getNoteColor = (note) => {
      const v = Number(note);
      if (!Number.isFinite(v)) return '#F2AE2E';
      if (useZeroToTwoScale) {
        if (v <= 0) return '#ef4444';
        if (v === 1) return '#f59e0b';
        return '#22c55e';
      }
      if (v <= 1) return '#ef4444';
      if (v === 2) return '#f59e0b';
      return '#22c55e';
    };

    const labels = this.timelineData.map(obs => {
      const d = new Date(obs.date);
      return d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    });

    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        labels,
        datasets: [{
          label: 'Observations',
          data: labels.map((x) => ({ x, y: 1 })),
          backgroundColor: this.timelineData.map(o => getNoteColor(o.note)),
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
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context) => this.timelineData[context[0].dataIndex].date,
              label: (context) => {
                const obs = this.timelineData[context.dataIndex];
                const txt = obs.observation ?? '';
                return txt.substring(0, 100) + (txt.length > 100 ? '...' : '');
              }
            }
          }
        },
        scales: {
          y: { display: false, beginAtZero: true, max: 2 },
          x: { type: 'category', grid: { display: false } }
        }
      }
    });
  }
}
