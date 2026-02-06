<?php
// Ont récupére la connexion a la base de données
require_once __DIR__ . '/../classes/Database.php';

header('Content-Type: application/json');

// Vérifier que la requête est bien en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// récupérer le derniér id de clause
$database = new Database();
$lastClauseId = $database->getLastClauseId();
$newClauseId = $lastClauseId ? ($lastClauseId + 1) : 1;

// Récupération et validation basique des champs
$id = $newClauseId;
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : null;
$objective = isset($_POST['objective']) ? trim($_POST['objective']) : null;
$input = isset($_POST['input']) ? trim($_POST['input']) : null;
$domaineId = isset($_POST['domaine']) ? trim($_POST['domaine']) : null;

if (empty($nom) || empty($objective) || empty($input) || empty($domaineId)) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants ou invalides']);
    exit;
}

try {
    $database = new Database();
    $clause = $database->addClause( $nom, $objective, $input, $domaineId, $id);
    
    echo json_encode([
        'success' => true,
        'message' => 'Clause ajoutée avec succès',
        'clause' => $clause
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
}
?>
