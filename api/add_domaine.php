<?php
require_once __DIR__ . '/../classes/Database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$nom = isset($_POST['nom']) ? trim($_POST['nom']) : null;

if (empty($nom)) {
    echo json_encode(['success' => false, 'message' => 'Le nom du domaine est requis']);
    exit;
}

try {
    $db = new Database();
    // compute next id as max(id)+1 to support tables without auto-increment
    $pdo = $db->getConnection();
    $stmt = $pdo->prepare("SELECT id FROM domaines ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch();
    $newId = $row ? intval($row['id']) + 1 : 1;
    $res = $db->addDomaine($nom, $newId);
    if ($res === false) throw new Exception('Insertion échouée');

    echo json_encode(['success' => true, 'message' => 'Domaine ajouté avec succès', 'id' => $res]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
}

?>
