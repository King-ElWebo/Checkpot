<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Marke Hinzufügen - Control-Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/insert.css">
  </head>
  <body>
      <!-- Datenbankverbindung -->
      <?php
include("connect.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Eingaben verarbeiten
    $titel = htmlspecialchars(trim($_POST['titel']));
    $beschreibung = htmlspecialchars(trim($_POST['beschreibung']));
    $link = filter_var(trim($_POST['link']));

    // Fehlerprüfung für Bild
    if (isset($_FILES['bild']) && $_FILES['bild']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['bild']['tmp_name'];
        $fileName = $_FILES['bild']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

        $uploadFileDir = './uploads/';
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0755, true);
        }
        $dest_path = $uploadFileDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $bild = $dest_path;
        } else {
            $error_message = 'Es gab ein Problem beim Hochladen des Bildes.';
        }
    } else {
        $error_message = 'Bild hochladen fehlgeschlagen.';
    }

    // Daten in Datenbank speichern
    if (!isset($error_message)) {
        $sql = "INSERT INTO marken (titel, beschreibung, bild, link) VALUES (?, ?, ?, ?)";

        if ($conn) {
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param("ssss", $titel, $beschreibung, $bild, $link);
                if ($stmt->execute()) {
                    $success_message = "Marke erfolgreich hinzugefügt!";
                } else {
                    $error_message = "Fehler beim Einfügen der Daten: " . $stmt->error;
                }
                $stmt->close();
            } else {
                $error_message = "Fehler beim Vorbereiten der SQL-Anweisung.";
            }
        } else {
            die("Verbindung zur Datenbank nicht hergestellt: " . $conn->connect_error);
        }
    }
}
?>

      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="/index.php">Checkpot Control-Panel</a>
          <a class="link" href="index.php">Zurück</a>
        </div>
      </nav>
      <!-- Navbar Ende -->
      
      <!-- Hauptinhalt -->
      <div class="container d-flex justify-content-center align-items-center">
        <div class="wrapper p-4 rounded shadow">
            <h1 class="wrapper-title mb-4">Marke Hinzufügen</h1>

            <?php if (isset($success_message)): ?>
              <div class="alert alert-success" role="alert">
                <?= $success_message ?>
              </div>
            <?php endif; ?>

            <?php if (isset($error_message)): ?>
              <div class="alert alert-danger" role="alert">
                <?= $error_message ?>
              </div>
            <?php endif; ?>

            <form action="insert_form.php" method="POST" enctype="multipart/form-data" class="w-100">
              <div class="mb-3">
                <label for="titel" class="form-label">Titel</label>
                <input type="text" class="form-control" id="titel" name="titel" required>
              </div>
              <div class="mb-3">
                <label for="beschreibung" class="form-label">Beschreibung</label>
                <textarea class="form-control" id="beschreibung" name="beschreibung" rows="4" required></textarea>
              </div>
              <div class="mb-3">
                <label for="bild" class="form-label">Bild</label>
                <input class="form-control" type="file" id="bild" name="bild" accept="image/*" required>
              </div>
              <div class="mb-3">
                <label for="link" class="form-label">Link</label>
                <input type="text" class="form-control" id="link" name="link" required>
              </div>
              <button type="submit" class="btn btn-primary">Marke Hinzufügen</button>
            </form>
          </div>
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
</html>