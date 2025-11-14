<!DOCTYPE html>
<html>
<head>
    <title>Edit Form</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/styles/edit.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/index.php">Checkpot Control-Panel</a>
            <a class="link" href="delete_form.php">Zurück</a>
        </div>
    </nav>
    <!-- Navbar Ende -->
</body>
</html>
<?php
// Datenbankverbindung herstellen
include("connect.php");

// Bearbeitungsaktion verarbeiten
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['edit_ids'])) {
        $edit_ids = explode(',', $_POST['edit_ids']);
        foreach ($edit_ids as $id) {
            // Hier können Sie die Daten des Datensatzes abrufen und bearbeiten
            $sql = "SELECT id, titel, beschreibung, bild FROM marken WHERE id=$id";
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            // Bearbeitungsformular anzeigen
            echo "<div class='container mt-5'>";
            echo "<h2 class='mb-4'>Edit Form</h2>";
            echo "<form method='post' action='edit_form.php' enctype='multipart/form-data'>";
            echo "<input type='hidden' name='id' value='" . $row["id"] . "'>";
            echo "<div class='form-group'>";
            echo "<label for='titel'>Titel:</label>";
            echo "<input type='text' class='form-control' name='titel' value='" . $row["titel"] . "'>";
            echo "</div>";
            echo "<div class='form-group'>";
            echo "<label for='beschreibung'>Beschreibung:</label>";
            echo "<textarea class='form-control' name='beschreibung'>" . $row["beschreibung"] . "</textarea>";
            echo "</div>";
            echo "<div class='form-group'>";
            echo "<label for='bild'>Aktuelles Bild:</label><br>";
            echo "<img src='" . $row["bild"] . "' alt='Bild' style='width: 100px; height: auto;'><br>";
            echo "<label for='bild'>Neues Bild hochladen:</label>";
            echo "<input type='file' class='form-control-file' name='bild'>";
            echo "</div>";
            echo "<input type='submit' class='btn btn-primary' value='Update'>";
            echo "</form>";
            echo "</div>";
        }
    } elseif (!empty($_POST['id'])) {
        // Aktualisierungsaktion verarbeiten
        $id = $_POST['id'];
        $titel = $_POST['titel'];
        $beschreibung = $_POST['beschreibung'];
        $bild = $_FILES['bild'];

        // Bild hochladen
        if ($bild['size'] > 0) {
            $target_dir = "uploads/";
            $target_file = $target_dir . basename($bild["name"]);
            move_uploaded_file($bild["tmp_name"], $target_file);
            $bild_path = $target_file;
        } else {
            // Wenn kein neues Bild hochgeladen wurde, behalten Sie das alte Bild bei
            $sql = "SELECT bild FROM marken WHERE id=$id";
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $bild_path = $row['bild'];
        }

        $sql = "UPDATE marken SET titel='$titel', beschreibung='$beschreibung', bild='$bild_path' WHERE id=$id";
        $conn->query($sql);

        // Zurück zur Bearbeitungsseite
        header("Location: edit_form.php");
        exit();
    }
}

$conn->close();
?>