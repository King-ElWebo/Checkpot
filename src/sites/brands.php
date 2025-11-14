<?php
include("connect.php"); // Verbindung zur Datenbank

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    echo "<div class='container mt-5'><div class='alert alert-danger'>Ungültige Marken-ID.</div></div>";
    exit;
}

$sql = "SELECT id, titel, beschreibung, bild FROM marken WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo "<div class='container mt-5'><div class='alert alert-danger'>Marke nicht gefunden.</div></div>";
    exit;
}

$bildPfad = "/src/admin/" . htmlspecialchars($row['bild']);
$vollstaendigerPfad = $_SERVER['DOCUMENT_ROOT'] . $bildPfad;
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Angeles</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/marken.css">
  </head>
  <body>
      <!-- databse connection -->
  <?php
  include("connect.php");
  ?>
  <!-- navbar -->
  <section>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand schrift text-white" href="../../index.php">Checkpot </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-white" href="#home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#fotos">Fotos Vom Geschäft</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Mode
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#vorschau">Vorschau auf Winter / Herbst 2024</a></li>
                <li><a class="dropdown-item" href="#marken">Unsere Marken</a></li>
                <li><a class="dropdown-item" href="#fairtrade">Fair Trade</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </section>
  <!-- navbar end -->
  <section id="marken" class="py-5">
    <div class="container marken-info">
      <div class="row justify-content-center ">
        <div class="col-md-6 text-center first-row">
          <h2 class="mb-4"><?= htmlspecialchars($row['titel']) ?></h2>
          <p class="lead"><?= nl2br(htmlspecialchars($row['beschreibung'])) ?></p>
          <?php if (file_exists($vollstaendigerPfad) && !empty($row['bild'])): ?>
          </div>  
          <div class="col-md-6">
            <img src="<?= $bildPfad ?>" class="img-fluid rounded shadow mb-4" alt="<?= htmlspecialchars($row['titel']) ?>">
          <?php else: ?>
            <img src="/src/admin/uploads/placeholder-image.jpg" class="img-fluid rounded shadow mb-4" alt="Bild nicht verfügbar">
          <?php endif; ?>
        </div>
      </div>
    </div>
  </section>

    <!-- footer -->
<footer class="footer text-white text-center py-4">
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-3 mb-md-0">
        <h5>Über Uns</h5>
        <p>Checkpot Hietzing bietet hochwertige, feminine Mode mit persönlicher Stilberatung.</p>
      </div>
      <div class="col-md-4 mb-3 mb-md-0">
        <h5>Kontakt</h5>
        <p>(01) 877 58 87</p>
        <p>store@checkpot-hietzing.at</p>
      </div>
      <div class="col-md-4">
        <h5>Folgen Sie uns</h5>
        <img class="insta" src="/src/img/insta.svg" alt="">
        <img class="insta" src="/src/img/facebook.svg" alt="">
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <p class="mb-0">&copy; 2024 Checkpot Hietzing. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </div>
</footer>
<!-- footer ende -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>