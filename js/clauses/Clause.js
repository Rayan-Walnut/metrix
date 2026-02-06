export default class Clause {
  sendInsert(endpoint, data, btn) {
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
