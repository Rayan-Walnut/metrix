// PreuveManager: gère upload/suppression/renommage/vidage de preuves
async function apiJson(url, { method = 'POST', body } = {}) {
  const r = await fetch(url, { method, body });
  let data;
  try { data = await r.json(); }
  catch { throw new Error(`Réponse invalide (${r.status})`); }
  if (!r.ok) throw new Error(data?.message || `HTTP ${r.status}`);
  return data;
}

export default class PreuveManager {
  constructor() {}

  async uploadPreuve(btn, clauseId) {
    const container = btn.closest('.preuve-container');
    const uploadDiv = btn.closest('.preuve-upload');
    const input = uploadDiv?.querySelector('.preuve-input');

    if (!input?.files?.length) return alert('Veuillez sélectionner un ou plusieurs fichiers');

    const files = [...input.files];
    btn.disabled = true;
    const original = btn.innerHTML;

    try {
      for (let i = 0; i < files.length; i++) {
        btn.innerHTML = `${i + 1}/${files.length}`;

        const fd = new FormData();
        fd.append('clause_id', clauseId);
        fd.append('preuve', files[i]);

        const result = await apiJson('api/upload_preuve.php', { body: fd });
        if (!result.success) throw new Error(result.message || 'Upload échoué');

        this.appendPreuveItem(container, uploadDiv, result);
        this.updatePreuvesCount(container);
      }
      input.value = '';
    } catch (err) {
      alert(`Erreur: ${err.message || err}`);
    } finally {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }

  appendPreuveItem(container, uploadDiv, result) {
    let preuvesList = container.querySelector('.preuves-list');
    if (!preuvesList) {
      preuvesList = document.createElement('div');
      preuvesList.className = 'preuves-list';
      container.insertBefore(preuvesList, uploadDiv);
    }

    const item = document.createElement('div');
    item.className = 'preuve-item';
    item.dataset.preuveId = result.preuveId;
    item.innerHTML = `
      <a href="${result.filepath}" target="_blank" class="preuve-link">
        <span class="preuve-filename">${result.filename}</span>
      </a>
      <button type="button" data-action="preuve-rename" data-id="${result.preuveId}" class="preuve-rename-btn" title="Renommer">...</button>
      <button type="button" data-action="preuve-delete" data-id="${result.preuveId}" class="preuve-delete-btn" title="Supprimer">...</button>
    `;
    preuvesList.appendChild(item);
  }

  async deletePreuve(btn, preuveId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette preuve ?')) return;

    const item = btn.closest('.preuve-item');
    const container = btn.closest('.preuve-container');
    btn.disabled = true;

    try {
      const fd = new FormData();
      fd.append('preuve_id', preuveId);

      const result = await apiJson('api/delete_preuve.php', { body: fd });
      if (!result.success) throw new Error(result.message || 'Suppression échouée');

      item?.remove();
      const list = container.querySelector('.preuves-list');
      if (list && list.children.length === 0) list.remove();
      this.updatePreuvesCount(container);
    } catch (err) {
      alert(`Erreur: ${err.message || err}`);
      btn.disabled = false;
    }
  }

  renamePreuve(btn, preuveId) {
    const item = btn.closest('.preuve-item');
    const filenameSpan = item?.querySelector('.preuve-filename');
    if (!filenameSpan) return;

    const current = filenameSpan.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'preuve-filename-input';
    input.value = current;

    filenameSpan.style.display = 'none';
    filenameSpan.parentNode.insertBefore(input, filenameSpan.nextSibling);
    btn.style.display = 'none';

    const actions = document.createElement('div');
    actions.className = 'preuve-rename-actions';
    actions.innerHTML = `
      <button type="button" class="preuve-rename-save" title="Valider">✓</button>
      <button type="button" class="preuve-rename-cancel" title="Annuler">✕</button>
    `;
    btn.parentNode.insertBefore(actions, btn);

    const cleanup = () => {
      input.remove();
      actions.remove();
      filenameSpan.style.display = '';
      btn.style.display = '';
    };

    const save = async () => {
      const next = input.value.trim();
      if (!next) return alert('Le nom ne peut pas être vide');
      if (next === current) return cleanup();

      actions.querySelectorAll('button').forEach(b => (b.disabled = true));

      try {
        const fd = new FormData();
        fd.append('preuve_id', preuveId);
        fd.append('filename', next);

        const result = await apiJson('api/rename_preuve.php', { body: fd });
        if (!result.success) throw new Error(result.message || 'Rename échoué');

        filenameSpan.textContent = next;
        cleanup();
      } catch (err) {
        alert(`Erreur: ${err.message || err}`);
        actions.querySelectorAll('button').forEach(b => (b.disabled = false));
      }
    };

    actions.querySelector('.preuve-rename-save').addEventListener('click', save);
    actions.querySelector('.preuve-rename-cancel').addEventListener('click', cleanup);

    input.focus();
    input.select();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); save(); }
      if (e.key === 'Escape') cleanup();
    });
  }

  async deleteAllPreuves(btn, clauseId) {
    if (!confirm('Êtes-vous sûr de vouloir vider toutes les preuves de cette clause ?')) return;

    const container = btn.closest('.preuve-container');
    btn.disabled = true;

    try {
      const fd = new FormData();
      fd.append('clause_id', clauseId);

      const result = await apiJson('api/delete_all_preuves.php', { body: fd });
      if (!result.success) throw new Error(result.message || 'Suppression échouée');

      container.querySelector('.preuves-list')?.remove();
      this.updatePreuvesCount(container);
    } catch (err) {
      alert(`Erreur: ${err.message || err}`);
      btn.disabled = false;
    }
  }

  updatePreuvesCount(container) {
    const section = container.closest('.preuve-section');
    const label = section?.querySelector('.content-label');
    const list = container.querySelector('.preuves-list');
    const count = list ? list.children.length : 0;

    let badge = label?.querySelector('.preuves-count');
    if (count > 0) {
      if (!badge && label) {
        badge = document.createElement('span');
        badge.className = 'preuves-count';
        label.appendChild(badge);
      }
      if (badge) badge.textContent = count;
    } else {
      badge?.remove();
    }

    let clearBtn = container.querySelector('.preuve-clear-all-btn');
    if (count > 0 && !clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'preuve-clear-all-btn';
      clearBtn.textContent = 'Vider tout';
      clearBtn.dataset.action = 'preuve-clear';
      clearBtn.dataset.id = container.dataset.clauseId;
      container.querySelector('.preuve-upload')?.appendChild(clearBtn);
    } else if (count === 0) {
      clearBtn?.remove();
    }
  }
}
