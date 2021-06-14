<?php



// Fetches word type
if (isset($_POST["fetchWordType"])) {
    $fetch = "A";
    $sql = "SELECT
    MIN($fetch), MAX($fetch),
    SELECT
        (
        (SELECT MAX(Score) FROM
        (SELECT TOP 50 PERCENT Score FROM Posts ORDER BY Score) AS BottomHalf)
        +
        (SELECT MIN(Score) FROM
        (SELECT TOP 50 PERCENT Score FROM Posts ORDER BY Score DESC) AS TopHalf)
        ) / 2 AS Median
    FROM doksonaliigid 
    GROUP BY $fetch";
    fetchJSON($sql);
}

// Fetches data from ALL korpuses
if (isset($_POST["fetchAll"]) && isset($_POST["fetchValue"])) {
    $fetch = "dokmeta." .$_POST["fetchValue"];
    $sql = "SELECT $fetch,
    COUNT(*) * 100.0 / (SELECT COUNT(*) from DOKMETA) AS protsent,
    COUNT(dokmeta.kood) AS tekste, SUM(dokarvud.sonu) AS sonu,
    SUM(dokarvud.vigu) AS vigu, SUM(dokarvud.lauseid) AS lauseid, SUM(dokarvud.veatyype) AS veatyype
    FROM dokmeta 
    JOIN dokarvud ON dokmeta.kood = dokarvud.kood 
    GROUP BY $fetch";
    fetchJSON($sql);
}

// Fetches data from SELECTED korpuses
if (isset($_POST["fetchSome"]) && isset($_POST["fetchValue"])) {
    $fetch = "dokmeta." .$_POST["fetchValue"];
    $codes = $_POST["fetchSome"];
    $values = [];
    foreach ($codes as $code) {
        array_push($values, '"' .$code .'"');
    }
    $values = implode(",", $values); // '[1,abc,2]' turns into '1,abc,2' for inserting into SQL
    $sql = "SELECT $fetch,
    COUNT(*) * 100.0 / (SELECT COUNT(*) from DOKMETA WHERE dokmeta.korpus IN ($values)) AS protsent,
    COUNT(dokmeta.kood) AS tekste, SUM(dokarvud.sonu) AS sonu,
    SUM(dokarvud.vigu) AS vigu, SUM(dokarvud.lauseid) AS lauseid, SUM(dokarvud.veatyype) AS veatyype
    FROM dokmeta 
    JOIN dokarvud ON dokmeta.kood = dokarvud.kood
    WHERE dokmeta.korpus IN ($values)
    GROUP BY $fetch";
    fetchJSON($sql);
}

// Fetches document count, word sum and sentence sum from selected korpuses
if (isset($_POST["fetchMiniStats"]) && isset($_POST["fetchValue"])) {
    $codes = $_POST["fetchMiniStats"];
    $values = [];
    foreach ($codes as $code) {
        array_push($values, '"' .$code .'"');
    }
    $values = implode(",", $values); // '[1,abc,2]' turns into '1,abc,2' for inserting into SQL
    $sql = "SELECT COUNT(dokmeta.kood) AS sum, SUM(dokarvud.lauseid) AS lauseid, SUM(dokarvud.sonu) AS sonu 
            FROM dokarvud
            JOIN dokmeta ON dokmeta.kood = dokarvud.kood
            WHERE dokmeta.korpus IN ($values)";
    fetchJSON($sql);
}

// Fetches selected korpus names
if (isset($_POST["fetchKorpusName"])) {
    $codes = $_POST["selectedKorpus"];
    $values = [];
    foreach ($codes as $code) {
        array_push($values, '"' .$code .'"');
    }
    $values = implode(",", $values);
    $sql = "SELECT korpusenimi
        FROM korpusenimed
        WHERE korpusekood IN ($values)";
    fetchJSON($sql);
}

// For the pie chart, fetches language use percentage
if (isset($_POST["fetchLanguagePercentage"])) {
    $sql = "SELECT tekstikeel,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) from dokmeta),1) AS protsent
        FROM dokmeta
        GROUP BY tekstikeel";
    fetchJSON($sql);
}


// Universal function for fetching and echoing data as JSON
function fetchJSON($sql) {
    include "database.php";
    try {
        $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName}", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = $pdo->prepare($sql);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo "Connection failed " .$e;
    }
    $pdo = null; // close connection
}





?>
