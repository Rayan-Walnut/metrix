export default class Clause {
  sendInsert(endpoint, data, btn) {
    console.log(btn)
    const formData = new FormData();
    for (const [k, v] of Object.entries(data)) formData.append(k, v);

    const old = btn.textContent;
    console.log(data)
    btn.textContent = 'En attente...';

    fetch(endpoint, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
            btn.textContent = 'Valider';
          btn.style.color = '#16a34a';
          setTimeout(() => {
            btn.style.color = '';
            btn.textContent = old;
          }, 900);
        } else {
          alert('Erreur: ' + result.message);
          btn.textContent = old;
        }
      })
      .catch(err => {
        alert('Erreur réseau: ' + err);
        btn.textContent = old;
      });
  }
}
