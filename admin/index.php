<?php
require_once '../classes/Database.php';
$database = new Database();
$domaines = $database->getDomaines();
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../styles/admin.css">
    <title>Admin - Ajouter une clause</title>
</head>

<body>
    <div>
        <label for="domaine">Domaine :</label>
        <select name="domaine" id="domaine">
            <?php foreach ($domaines as $d): ?>
                <option value="<?= $d['id'] ?>"><?= $d['nom'] ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <input name="nom" id="nom" placeholder="Nom de la clause" />

        <input name="objective" id="objective" placeholder="Objectif de la clause" />

        <input name="input" id="input" placeholder="Input de la clause" />

        <button id="add-clause-btn" type="button">Ajouter</button>
    </div>
    <script type="module" src="../js/admin/admin.js"></script>
</body>

</html>