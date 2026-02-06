<?php
require_once '../classes/Database.php';
$database = new Database();
$domaines = $database->getDomaines();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/admin.css">
    <title>Admin - Ajouter une clause</title>
</head>

<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Ajouter une clause</h1>
            <p class="subtitle">Complétez les informations ci-dessous pour créer une nouvelle clause</p>
        </header>
        <!-- Sidebar Admin Navigation -->
        <nav class="admin-sidebar" id="admin-sidebar">
            <div class="sidebar-brand">
                <img src="../ressources/logo.png" alt="Logo" class="brand-logo" />
                <div class="brand-text">
                    <span class="brand-name">Metrix</span>
                    <span class="brand-sub">ADMIN</span>
                </div>
            </div>

            <div class="admin-sidebar-header">
                <h2>Administration</h2>
            </div>

            <div class="admin-sidebar-content">
                <div class="admin-nav-section">
                    <h3 class="admin-nav-title">Gestion des clauses</h3>
                    <a href="index.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : '' ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Ajouter une clause</span>
                    </a>
                </div>

                <div class="admin-nav-section">
                    <a href="ajouter-domaine.php" class="admin-nav-link <?= basename($_SERVER['PHP_SELF']) === 'ajouter-domaine.php' ? 'active' : '' ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        <span>Ajouter un domaine</span>
                    </a>
                </div>
            </div>

            <div class="admin-sidebar-footer">
                <div class="admin-user-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Administrateur</span>
                </div>
            </div>
        </nav>

        <div class="form-card">
            <form id="clause-form">
                <div class="form-section">
                    <h2 class="section-title">Informations générales</h2>
                    
                    <div class="form-group">
                        <label for="domaine">Domaine <span class="required">*</span></label>
                        <select name="domaine" id="domaine" required>
                            <option value="">Sélectionnez un domaine</option>
                            <?php foreach ($domaines as $d): ?>
                                <option value="<?= $d['id'] ?>"><?= htmlspecialchars($d['nom']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="nom">Nom de la clause <span class="required">*</span></label>
                        <input 
                            type="text"
                            name="nom" 
                            id="nom" 
                            placeholder="Ex: Clause de confidentialité"
                            required
                        />
                    </div>
                </div>

                <div class="form-section">
                    <h2 class="section-title">Détails de la clause</h2>
                    
                    <div class="form-group">
                        <label for="objective">Objectif de la clause <span class="required">*</span></label>
                        <textarea 
                            name="objective" 
                            id="objective" 
                            placeholder="Décrivez l'objectif principal de cette clause..."
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="input">Input de la clause <span class="required">*</span></label>
                        <textarea 
                            name="input" 
                            id="input" 
                            placeholder="Saisissez le contenu ou les paramètres de la clause..."
                            rows="4"
                            required
                        ></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">Annuler</button>
                    <button id="add-clause-btn" type="button" class="btn btn-primary">
                        Ajouter la clause
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <script type="module" src="../js/main.js"></script>
</body>

</html>