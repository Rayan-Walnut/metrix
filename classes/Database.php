<?php

class Database {
    private $db;

    public function __construct() {
        $this->connect();
    }

    // Gestion de la connexion avec une die php pour éviter les erreurs fatales en cas de problème de connexion
    private function connect() {
        try {
            $this->db = new PDO(
                "mysql:host=srw-deming.intra.cg30.fr;dbname=pssi;charset=utf8",
                "pssi",
                "ZeNewPSSI?"
            );
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    private function reconnectIfNeeded() {
        try {
            $this->db->query("SELECT 1");
        } catch (PDOException $e) {
            $this->connect();
        }
    }

    public function getClauses() {
        $this->reconnectIfNeeded();
        $sql = "
            SELECT 
                clauses.id,
                clauses.nom,
                clauses.objective AS Titre,
                clauses.input AS Objective,
                clauses.domaineid,
                domaines.nom AS domaine_nom
            FROM clauses
            JOIN domaines ON clauses.domaineid = domaines.id
            ORDER BY clauses.domaineid, clauses.nom
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    public function getDomaines() {
        $sql = "SELECT id, nom FROM domaines ORDER BY nom";
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    public function getClauseById($id) {
        $sql = "
            SELECT 
                clauses.id,
                clauses.nom,
                clauses.objective AS Titre,
                clauses.input AS Objective,
                clauses.domaineid,
                domaines.nom AS domaine_nom
            FROM clauses
            JOIN domaines ON clauses.domaineid = domaines.id
            WHERE clauses.id = :id
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute([':id' => $id]);
        return $req->fetch();
    }

    public function getLastClauseId() {
        $sql = "SELECT id FROM clauses ORDER BY id DESC LIMIT 1";
        $req = $this->db->prepare($sql);
        $req->execute();
        $result = $req->fetch();
        return $result ? intval($result['id']) : null;
    }

    public function getMetrics() {
        $sql = "
            SELECT 
                metriques.id AS metrique_id,
                metriques.nom,
                metriques.clauseid,
                metriques.desc
            FROM metriques
            JOIN clauses ON metriques.clauseid = clauses.id
            ORDER BY metriques.clauseid, metriques.nom
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    public function getObservations() {
        $sql = "
            SELECT
                observations.id,
                observations.date,
                observations.clauseid,
                observations.observation,
                observations.note
            FROM observations
            ORDER BY observations.clauseid, observations.date
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    public function getValues() {
        $sql = "
            SELECT
                valeurs.metriqueid,
                valeurs.date,
                valeurs.value
            FROM valeurs
            ORDER BY valeurs.metriqueid, valeurs.date
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    public function updateMetricValue($metriqueId, $newValue, $date = null) {
        if ($date === null) {
            $date = date('Y-m-d');
        }

        $checkSql = "SELECT metriqueid FROM valeurs WHERE metriqueid = :metrique_id AND date = :date";
        $checkStmt = $this->db->prepare($checkSql);
        $checkStmt->execute([
            ':metrique_id' => $metriqueId,
            ':date' => $date
        ]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            $updateSql = "UPDATE valeurs SET value = :value WHERE metriqueid = :metrique_id AND date = :date";
            $updateStmt = $this->db->prepare($updateSql);
            return $updateStmt->execute([
                ':value' => $newValue,
                ':metrique_id' => $metriqueId,
                ':date' => $date
            ]);
        } else {
            $insertSql = "INSERT INTO valeurs (metriqueid, date, value) VALUES (:metrique_id, :date, :value)";
            $insertStmt = $this->db->prepare($insertSql);
            return $insertStmt->execute([
                ':metrique_id' => $metriqueId,
                ':date' => $date,
                ':value' => $newValue
            ]);
        }
    }

    /**
     * Récupère toutes les valeurs des 12 derniers mois pour TOUTES les métriques en une seule requête
     * Évite le problème N+1 queries
     */
    public function getAllValuesLastYear() {
        $this->reconnectIfNeeded();
        
        $sql = "
            SELECT
                valeurs.metriqueid,
                valeurs.date,
                valeurs.value
            FROM valeurs
            WHERE valeurs.date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            ORDER BY valeurs.metriqueid, valeurs.date ASC
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute();
        $allValues = $req->fetchAll();

        // Grouper par métrique
        $valuesByMetric = [];
        foreach ($allValues as $value) {
            $metriqueId = $value['metriqueid'];
            if (!isset($valuesByMetric[$metriqueId])) {
                $valuesByMetric[$metriqueId] = [];
            }
            $valuesByMetric[$metriqueId][] = $value;
        }

        // Préparer les 12 derniers mois
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = new DateTime();
            $date->modify("-$i month");
            $months[] = $date->format('Y-m');
        }

        // Transformer les données pour chaque métrique
        $result = [];
        foreach ($valuesByMetric as $metriqueId => $values) {
            $monthlyData = array_fill_keys($months, []);

            foreach ($values as $value) {
                $yearMonth = substr($value['date'], 0, 7);
                if (isset($monthlyData[$yearMonth])) {
                    $monthlyData[$yearMonth][] = [
                        'value' => floatval($value['value']),
                        'date' => $value['date']
                    ];
                }
            }

            $metricResult = [];
            foreach ($monthlyData as $yearMonth => $monthValues) {
                if (!empty($monthValues)) {
                    $values_only = array_column($monthValues, 'value');
                    $avg = array_sum($values_only) / count($values_only);
                    usort($monthValues, fn($a, $b) => strcmp($a['date'], $b['date']));
                    $lastEntry = end($monthValues);
                    $metricResult[] = [
                        'date' => $yearMonth,
                        'value' => round($avg, 2),
                        'count' => count($monthValues),
                        'lastValue' => $lastEntry['value'],
                        'lastDate' => $lastEntry['date']
                    ];
                } else {
                    $metricResult[] = [
                        'date' => $yearMonth,
                        'value' => null,
                        'count' => 0,
                        'lastValue' => null,
                        'lastDate' => null
                    ];
                }
            }
            $result[$metriqueId] = $metricResult;
        }

        return $result;
    }

    public function getValuesByMetricLastYear($metriqueId) {
        // Récupérer toutes les valeurs des 12 derniers mois
        $sql = "
            SELECT
                valeurs.metriqueid,
                valeurs.date,
                valeurs.value
            FROM valeurs
            WHERE valeurs.metriqueid = :metrique_id 
            AND valeurs.date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            ORDER BY valeurs.date ASC
        ";
        
        $req = $this->db->prepare($sql);
        $req->execute([':metrique_id' => $metriqueId]);
        $values = $req->fetchAll();

        // Créer un tableau pour les 12 mois glissants
        $monthlyData = [];
        
        // Initialiser les 12 derniers mois
        for ($i = 11; $i >= 0; $i--) {
            $date = new DateTime();
            $date->modify("-$i month");
            $yearMonth = $date->format('Y-m');
            $monthlyData[$yearMonth] = [];
        }

        // Grouper les valeurs par mois
        foreach ($values as $value) {
            $yearMonth = substr($value['date'], 0, 7); // Format: YYYY-MM
            if (isset($monthlyData[$yearMonth])) {
                $monthlyData[$yearMonth][] = [
                    'value' => floatval($value['value']),
                    'date' => $value['date']
                ];
            }
        }

        // Retourner les moyennes pour chaque mois, y compris les trous
        $result = [];
        foreach ($monthlyData as $yearMonth => $monthValues) {
            if (!empty($monthValues)) {
                $values_only = array_column($monthValues, 'value');
                $avg = array_sum($values_only) / count($values_only);
                usort($monthValues, function($a, $b) {
                    return strcmp($a['date'], $b['date']);
                });
                $lastEntry = end($monthValues);
                $result[] = [
                    'date' => $yearMonth,
                    'value' => round($avg, 2),
                    'count' => count($monthValues),
                    'lastValue' => $lastEntry['value'],
                    'lastDate' => $lastEntry['date']
                ];
            } else {
                $result[] = [
                    'date' => $yearMonth,
                    'value' => null,
                    'count' => 0,
                    'lastValue' => null,
                    'lastDate' => null
                ];
            }
        }

        return $result;
    }

    public function addClause($nom, $objective, $input, $domaineId) {
        $this->reconnectIfNeeded();
        $sql = "INSERT INTO clauses (nom, objective, input, id) VALUES (:nom, :objective, :input, :id)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            ':nom' => $nom,
            ':objective' => $objective,
            ':input' => $input,
            ':id' => $domaineId
        ]);

        if ($result) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function updateObservation($observationId, $newObservation, $note = null) {
        if ($note !== null) {
            $updateSql = "UPDATE observations SET observation = :observation, note = :note WHERE id = :id";
            $updateStmt = $this->db->prepare($updateSql);
            return $updateStmt->execute([
                ':observation' => $newObservation,
                ':note' => $note,
                ':id' => $observationId
            ]);
        } else {
            $updateSql = "UPDATE observations SET observation = :observation WHERE id = :id";
            $updateStmt = $this->db->prepare($updateSql);
            return $updateStmt->execute([
                ':observation' => $newObservation,
                ':id' => $observationId
            ]);
        }
    }

    public function updateClausePreuve($clauseId, $preuvePath) {
        $this->reconnectIfNeeded();
        $updateSql = "UPDATE clauses SET preuve = :preuve WHERE id = :id";
        $updateStmt = $this->db->prepare($updateSql);
        return $updateStmt->execute([
            ':preuve' => $preuvePath,
            ':id' => $clauseId
        ]);
    }

    /**
     * Récupère toutes les preuves groupées par clause
     */
    public function getPreuves() {
        $this->reconnectIfNeeded();
        $sql = "
            SELECT 
                id,
                clauseid,
                filepath,
                filename,
                uploaded_at
            FROM preuves
            ORDER BY clauseid, uploaded_at DESC
        ";
        $req = $this->db->prepare($sql);
        $req->execute();
        return $req->fetchAll();
    }

    /**
     * Ajoute une nouvelle preuve pour une clause
     */
    public function addPreuve($clauseId, $filepath, $filename) {
        $this->reconnectIfNeeded();
        $sql = "INSERT INTO preuves (clauseid, filepath, filename) VALUES (:clauseid, :filepath, :filename)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            ':clauseid' => $clauseId,
            ':filepath' => $filepath,
            ':filename' => $filename
        ]);
        
        if ($result) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    /**
     * Supprime une preuve par son ID
     */
    public function deletePreuve($preuveId) {
        $this->reconnectIfNeeded();
        
        // D'abord récupérer le filepath pour supprimer le fichier
        $selectSql = "SELECT filepath FROM preuves WHERE id = :id";
        $selectStmt = $this->db->prepare($selectSql);
        $selectStmt->execute([':id' => $preuveId]);
        $preuve = $selectStmt->fetch();
        
        if ($preuve) {
            $deleteSql = "DELETE FROM preuves WHERE id = :id";
            $deleteStmt = $this->db->prepare($deleteSql);
            $result = $deleteStmt->execute([':id' => $preuveId]);
            
            if ($result) {
                return $preuve['filepath']; // Retourne le chemin pour suppression du fichier
            }
        }
        return false;
    }

    /**
     * Supprime toutes les preuves d'une clause
     */
    public function deleteAllPreuvesByClause($clauseId) {
        $this->reconnectIfNeeded();
        
        // D'abord récupérer tous les filepaths pour supprimer les fichiers
        $selectSql = "SELECT filepath FROM preuves WHERE clauseid = :clauseid";
        $selectStmt = $this->db->prepare($selectSql);
        $selectStmt->execute([':clauseid' => $clauseId]);
        $preuves = $selectStmt->fetchAll();
        
        $filepaths = [];
        foreach ($preuves as $preuve) {
            $filepaths[] = $preuve['filepath'];
        }
        
        // Supprimer toutes les preuves de la clause
        $deleteSql = "DELETE FROM preuves WHERE clauseid = :clauseid";
        $deleteStmt = $this->db->prepare($deleteSql);
        $deleteStmt->execute([':clauseid' => $clauseId]);
        
        return $filepaths;
    }

    /**
     * Renomme une preuve (change le nom affiché)
     */
    public function renamePreuve($preuveId, $newFilename) {
        $this->reconnectIfNeeded();
        
        $sql = "UPDATE preuves SET filename = :filename WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':filename' => $newFilename,
            ':id' => $preuveId
        ]);
    }

    public function getConnection() {
        return $this->db;
    }
}
?>
