import ObservationTimeline from '../charts/ObservationTimeline.js';

export function toggleObservationHistory(btn) {
  const historyContainer = btn.closest('.observation-history-toggle')?.nextElementSibling;
  if (!historyContainer) return;

  const isVisible = historyContainer.style.display !== 'none';
  historyContainer.style.display = isVisible ? 'none' : 'flex';
  btn.classList.toggle('expanded');

  if (isVisible) return;

  const canvas = historyContainer.querySelector('canvas[id^="timeline-"]');
  if (!canvas) return;

  if (Chart.getChart(canvas)) return;

  const clauseId = canvas.id.replace('timeline-', '');
  const script = document.querySelector(`script[data-timeline-id="${clauseId}"]`);
  if (!script?.textContent) return;

  try {
    const data = JSON.parse(script.textContent);
    if (Array.isArray(data) && data.length > 0) {
      new ObservationTimeline(clauseId, data).init();
    }
  } catch (err) {
    console.error('Erreur init timeline au toggle:', err);
  }
}
