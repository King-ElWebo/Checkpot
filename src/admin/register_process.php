<?php
session_start();
require("connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Eingaben abrufen und ggf. validieren
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    // Überprüfen, ob Eingaben leer sind
    if (empty($username) || empty($password)) {
        echo "Benutzername und Passwort dürfen nicht leer sein. <a href='register.php'>Zurück</a>";
        exit();
    }

    // Passwort hashen
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Vorbereitetes Statement verwenden
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    if ($stmt === false) {
        die("Prepare failed: " . htmlspecialchars($conn->error));
    }

    $stmt->bind_param("ss", $username, $hashedPassword);

    if ($stmt->execute()) {
        echo "Registration successful. <a href='login.php'>Login</a>";
    } else {
        // Überprüfen, ob der Benutzername bereits existiert (z.B. UNIQUE constraint)
        if ($conn->errno === 1062) { // Duplicate entry error code
            echo "Benutzername bereits vergeben. <a href='register.php'>Erneut versuchen</a>";
        } else {
            echo "Fehler bei der Registrierung: " . htmlspecialchars($stmt->error);
        }
    }

    $stmt->close();
}

$conn->close();
?>