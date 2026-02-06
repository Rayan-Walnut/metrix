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

$nom = $_POST['nom'] ?? null;
$objective = $_POST['objective'] ?? null;
$input = $_POST['input'] ?? null;
$domaineId = $_POST['domaine'] ?? null;

try {
    $database = new Database();
    $clause = $database->addClause($nom, $objective, $input, $domaineId);
    
    echo json_encode([
        'success' => true,
        'message' => 'Clause ajoutée avec succès',
        'clause' => $clause
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
}
?>
