<?php

class DataGrouper {
    // Group clauses
    public static function groupClauses($rows) {
        $rowsByDomain = [];
        foreach ($rows as $row) {
            $domainId = $row['domaineid'];
            if (!isset($rowsByDomain[$domainId])) {
                $rowsByDomain[$domainId] = [
                    'nom' => $row['domaine_nom'], 
                    'clauses' => []
                ];
            }
            $rowsByDomain[$domainId]['clauses'][] = $row;
        }
        return $rowsByDomain;
    }

    // Group Metrics - Gère les clauseid multiples séparés par des virgules
    public static function groupMetrics($metrics) {
        $metricsByClause = [];
        foreach ($metrics as $metric) {
            $clauseIds = $metric['clauseid'];
            // Gérer les clauseid multiples (ex: "1011,1089")
            $clauseIdArray = array_map('trim', explode(',', $clauseIds));
            
            foreach ($clauseIdArray as $clauseId) {
                if (empty($clauseId)) continue;
                
                if (!isset($metricsByClause[$clauseId])) {
                    $metricsByClause[$clauseId] = [];
                }
                $metricsByClause[$clauseId][] = $metric;
            }
        }
        return $metricsByClause;
    }

    // Group Observations
    public static function groupObservations($observations) {
        $observationsByClause = [];
        foreach ($observations as $observation) {
            $clauseId = $observation['clauseid'];
            if (!isset($observationsByClause[$clauseId])) {
                $observationsByClause[$clauseId] = [];
            }
            $observationsByClause[$clauseId][] = $observation;
        }
        return $observationsByClause;
    }

    // Group Values
    public static function groupValues($values) {
        $valuesByMetric = [];
        foreach ($values as $valeur) {
            $metriqueId = $valeur['metriqueid'];
            if (!isset($valuesByMetric[$metriqueId])) {
                $valuesByMetric[$metriqueId] = [];
            }
            $valuesByMetric[$metriqueId][] = $valeur;
        }
        return $valuesByMetric;
    }

    // Group Preuves par clause
    public static function groupPreuves($preuves) {
        $preuvesByClause = [];
        foreach ($preuves as $preuve) {
            $clauseId = $preuve['clauseid'];
            if (!isset($preuvesByClause[$clauseId])) {
                $preuvesByClause[$clauseId] = [];
            }
            $preuvesByClause[$clauseId][] = $preuve;
        }
        return $preuvesByClause;
    }
}
?>
