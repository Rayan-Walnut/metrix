export function initMetricTooltips() {
  document.querySelectorAll('.metric-info-icon[data-tooltip-content]').forEach(icon => {
    const tooltip = icon.querySelector('.metric-tooltip');
    const content = icon.getAttribute('data-tooltip-content');
    if (!tooltip || !content) return;

    if (content.includes('https://') || content.includes('http://')) {
      const url = content.match(/(https?:\/\/\S+)/i);
      if (url) {
        tooltip.innerHTML =
          `<a href="${url[1]}" target="_blank" rel="noopener noreferrer">${content}</a>`;
      } else {
        tooltip.textContent = content;
      }
    } else {
      tooltip.textContent = content;
    }
  });
}
