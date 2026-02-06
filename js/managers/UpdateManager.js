export default class UpdateManager {
  updateMetricValue(btn, metriqueId) {
    const input = btn.parentElement.querySelector('.metric-value-input');
    const newValue = input?.value;

    if (newValue === '' || newValue === null || Number.isNaN(Number(newValue))) {
      alert('Veuillez entrer une valeur valide');
      return;
    }

    this.sendUpdate('api/update_metric.php', { metrique_id: metriqueId, value: newValue }, btn);
  }

  updateObservation(btn, observationId) {
    const container = btn.closest('.observation-editor');
    const textarea = container?.querySelector('.observation-input');
    const notePicker = container?.querySelector('.note-color-picker');
    const activeNote = notePicker?.querySelector('.note-color-btn.active');
    const newObservation = textarea?.value ?? '';

    if (newObservation.trim() === '') {
      alert('Veuillez entrer une observation');
      return;
    }

    this.sendUpdate(
      'api/update_observation.php',
      {
        observation_id: observationId,
        observation: newObservation,
        note: activeNote ? activeNote.dataset.value : null
      },
      btn
    );
  }

  sendUpdate(endpoint, data, btn) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(data)) formData.append(k, v);

    btn.disabled = true;
    const old = btn.textContent;
    btn.textContent = '...';

    fetch(endpoint, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          btn.textContent = '✓';
          btn.style.color = '#16a34a';
          setTimeout(() => {
            btn.style.color = '';
            btn.disabled = false;
            btn.textContent = old;
          }, 900);
        } else {
          alert('Erreur: ' + result.message);
          btn.disabled = false;
          btn.textContent = old;
        }
      })
      .catch(err => {
        alert('Erreur réseau: ' + err);
        btn.disabled = false;
        btn.textContent = old;
      });
  }
}
