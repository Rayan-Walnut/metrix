import MetricChart from '../charts/MetricChart.js';
import ObservationTimeline from '../charts/ObservationTimeline.js';

const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export default class ChartManager {
  constructor() {}

  initializeVisibleCharts() {
    $$('.clauses-list').forEach(c => {
      const hidden = c.classList.contains('is-collapsed') || c.style.display === 'none';
      if (!hidden) this.initializeCharts(c);
    });
  }

  initializeCharts(root = document) {
    // destroy
    $$('canvas[id^="chart-"], canvas[id^="timeline-"]', root).forEach(canvas => {
      Chart.getChart(canvas)?.destroy();
    });

    // init metrics
    $$('canvas[id^="chart-"]', root).forEach(canvas => {
      const id = canvas.id.slice('chart-'.length);
      const script = document.querySelector(`script[data-chart-id="${id}"]`);
      const txt = script?.textContent;
      if (!txt) return;

      try {
        const data = JSON.parse(txt);
        if (Array.isArray(data) && data.length) new MetricChart(id, data).init();
      } catch (e) { console.error(`Erreur init chart ${id}:`, e); }
    });

    // init timelines
    $$('canvas[id^="timeline-"]', root).forEach(canvas => {
      const id = canvas.id.slice('timeline-'.length);
      const script = document.querySelector(`script[data-timeline-id="${id}"]`);
      const txt = script?.textContent;
      if (!txt) return;

      try {
        const data = JSON.parse(txt);
        if (Array.isArray(data) && data.length) new ObservationTimeline(id, data).init();
      } catch (e) { console.error(`Erreur init timeline ${id}:`, e); }
    });
  }
}
