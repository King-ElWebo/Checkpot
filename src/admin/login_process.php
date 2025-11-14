<?php
session_start();
require("connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    if ($stmt === false) {
        die("Prepare failed: " . htmlspecialchars($conn->error));
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['id'] = $row['id'];
            $_SESSION['username'] = $row['username'];

            session_regenerate_id(true);

            header("Location: index.php");
            exit();
        } else {
            echo "Falsches Passwort. <a href='index.php'>Erneut versuchen</a>";
        }
    } else {
        echo "Probiers noch amal!. <a href='index.php'>Login</a>";
    }

    $stmt->close();
}

$conn->close();
?>