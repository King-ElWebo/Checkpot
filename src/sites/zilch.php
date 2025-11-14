<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zilch</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/marken.css">
  </head>
  <body>
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
   <!-- Marken Info -->

    <section id="marken">
      <div class="container narken-info">
        <div class="row ">
          <div class="col-md-6 first-row">
            <h2>Zilch</h2>
            <p>Das niederländische Label Zilch steht für nachhaltige Mode, die durch ihre fröhlichen Farben und Muster besticht. Die Kollektionen sind aus hochwertigen Materialien gefertigt und überzeugen durch ihre Langlebigkeit. Zilch bietet eine große Auswahl an Kleidern, Röcken, Blusen und Hosen, die sich perfekt miteinander kombinieren lassen. Die Marke setzt auf faire Produktionsbedingungen und achtet auf umweltfreundliche Herstellungsprozesse. Zilch ist die ideale Wahl für Frauen, die Wert auf nachhaltige Mode mit femininem Design legen.</p>
          </div>
          <div class="col-md-6">
            <img src="/src/img/zilch.jpg" class="img-fluid image" alt="Zilch">
          </div>
        </div>
      </div>
    </section>
    <!-- Marken Info Ende -->

    <!-- Lokal Infos -->
    <section id="vorschau">
      <div class="infos">
        <div class="row row3">
          <div class="col-md-4">
            <h3>Maps</h3>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.996916798793!2d16.297759929831393!3d48.187410896890455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da7e393b19da3%3A0x6befdf48a6cf37e!2sCheckpot!5e0!3m2!1sde!2sat!4v1727879395466!5m2!1sde!2sat" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div class="col-md-4">
          <h3>Öffnungszeiten</h3>
          <p class="öffnungszeiten">
              Mo 10-18 Uhr <br>
              Di 10-18 Uhr <br>
              Mi 10-18 Uhr <br>
              Do 10-18 Uhr <br>
              Fr 10-18 Uhr <br>
              Sa 10-14 Uhr <br><br>
              Checkpot Damenmoden <br>
              Hietzinger Hauptstraße 10-16 <br>
              1130 Wien <br>
              AUT
          </p>
        </div>
        <div class="col-md-4">
          <h3>Kontakt</h3>
          <div class="kontakt">
            <button class="btn btn-light primary">(01) 877 58 87</button><br>
            <button class="btn btn-light primary">store@checkpot-hietzing.at</button><br>
            <button class="btn btn-light primary">Instagram</button><br>
            <button class="btn btn-light primary">Facebook</button>
          </div>
        </div>
      </div>
  </div>
 </section>
<!-- Lokal Info Ende -->
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