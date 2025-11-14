<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seite nicht gefunden - 404</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/404.css">
    <style>
        .error-container {
            height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .error-code {
            font-size: 10rem;
            font-weight: bold;
            color: #BE1819; /* Primäre Farbe */
        }
        .error-message {
            font-size: 2rem;
            margin-top: 20px;
        }
        .home-button {
            margin-top: 30px;
        }
    </style>
</head>
<body>
      <!-- navbar -->
  <section>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand schrift text-white" href="index.php">Checkpot </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <!-- <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-white" href="#home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#fotos">Fotos Vom Geschäft</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Marken
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/src/sites/kingluoie.php">KingLouie</a></li>
                <li><a class="dropdown-item" href="/src/sites/zilch.php">Zilch</a></li>
                <li><a class="dropdown-item" href="/src/sites/angels.php">Angels</a></li>
                <li><a class="dropdown-item" href="/src/sites/sorgenfri.php">Sorgenfri</a></li>
                <li><a class="dropdown-item" href="/src/sites/adini.php">Adini</a></li>
                <li><a class="dropdown-item" href="/src/sites/madness.php">Madness</a></li>
                <li><a class="dropdown-item" href="/src/sites/emilyvandenbergh.php">Emily van den Bergh</a></li>
              </ul>
            </li>
          </ul> -->
        </div>
      </div>
    </nav>
  </section>
  <!-- navbar end -->

    <div class="error-container">
        <div class="error-code">404</div>
        <div class="error-message">Seite nicht gefunden</div>
        <a href="/" class="btn btn-primary home-button">Zurück zur Startseite</a>
    </div>
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


    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.5.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>