import Clause from '../clauses/Clause.js';

const clause = new Clause();

function initAdmin() {
    const btn = document.getElementById('add-clause-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const domaine = document.getElementById('domaine') ? document.getElementById('domaine').value : null;
        const nom = document.getElementById('nom') ? document.getElementById('nom').value.trim() : '';
        const objective = document.getElementById('objective') ? document.getElementById('objective').value.trim() : '';
        const input = document.getElementById('input') ? document.getElementById('input').value.trim() : '';

        const data = {
            domaine: domaine,
            nom: nom,
            objective: objective,
            input: input
        };

        clause.sendInsert('../api/add_clause.php', data, btn);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}
