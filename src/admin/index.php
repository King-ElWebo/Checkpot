<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Control-Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/admin.css">
  </head>
  <body>
      <!-- Datenbankverbindung -->
  <?php
  include("connect.php");
  ?>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="/index.php">Checkpot Control-Panel</a>
    </div>
  </nav>
  <!-- Navbar Ende -->
  
  <!-- Hauptinhalt -->
  <div class="container d-flex justify-content-center align-items-center">
    <div class="wrapper text-center">
        <h1 class="wrapper-title mb-4">Control-Panel</h1>
        <div class="d-flex flex-column flex-md-column justify-content-center gap-3">
          <a href="insert_form.php" class="btn btn-primary flex-fill">Marke hinzufügen</a>
          <a href="delete_form.php" class="btn btn-primary flex-fill">Marke löschen/verändern</a>
        </div>
      </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>