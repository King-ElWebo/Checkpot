<?php
$servername = "localhost"; // Datenbank-Host
$username = "root"; // Datenbank-Benutzername
$password = ""; // Datenbank-Passwort
$dbname = "checkpot"; // Name der Datenbank

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Verbindung überprüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>
