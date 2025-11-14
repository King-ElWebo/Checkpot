<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkpot</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/src/styles/style.css">
</head>
<body data-bs-spy="scroll" data-bs-target="#navbarNavDropdown" data-bs-offset="0" tabindex="0">
  <!-- databse connection -->
  <?php
  include("connect.php");
  ?>
  <!-- navbar -->
  <section>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand schrift text-white" href="index.php">Checkpot </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-white" href="404.php">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="404.php">Fotos Vom Geschäft</a>
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
          </ul>
        </div>
      </div>
    </nav>
  </section>
  <!-- navbar end -->
  <!-- Hero -->
  <div id="home" class="hero-section">
    <div class="bg-image" style="background-image: url('/src/img/1.jpg');"></div>
    <div class="mask"></div>
    <div class="hero-content d-flex justify-content-center align-items-center h-100">
      <div class="text-white text-center">
        <h1 class="mb-3">Checkpot</h1>
        <h4 class="mb-3">Bist du Bereit für Individualität!</h4>
        <!-- Updated Button to Scroll to First Wrapper -->
        <a class="btn btn-outline-light btn-lg" href="#überuns" role="button">Mehr erfahren!</a>
      </div>
    </div>
  </div>
  <!-- Hero -->
  <script>
  document.addEventListener("DOMContentLoaded", function() {
    var navbar = document.querySelector(".navbar-custom");
    window.addEventListener("scroll", function() {
      if (window.scrollY > 100) { 
        navbar.classList.add("visible");
      } else {
        navbar.classList.remove("visible");
      }
    });
  });
  </script>
  <!-- Section info with target id -->
  <img src="/src/admin/uploads/" alt="">
  <section>
    <div class="scrollspy-example" id="überuns" tabindex="0">
      <div class="wrapper">
        <div class="row row2">
          <div class="col-md-6 info-text-1">
            <h1>Willkommen bei Checkpot Hietzing!</h1>
            <h3>Damenmode, die immer miteinander kombinierbar ist</h3>
            <p>„Bei uns finden Sie nicht die gängigen Trends, die alle tragen – sondern hochwertige, feminine Mode, die wir durch einfühlsame, persönliche Stilberatung perfekt auf den Typ der Kundin abstimmen. Wir freuen uns, Sie in unserem Geschäft begrüßen zu dürfen und werden uns für Sie die Zeit nehmen, die Sie sich für eine individuelle Beratung wünschen!“</p>
            <p>- Christa Hausmair, Gründerin „Checkpot Hietzing“</p>
            <a href="404.php" type="button" class="btn btn-danger primary">Über Uns</a>
          </div>
          <div class="col-md-6">
            <img class="selfie img-fluid" src="/src/img/christa.jpeg" alt="Checkpot">
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Section info end -->
   <!-- Unsere Mode Section -->
    <section>
      <div class="mode">
        <h1>Unsere Mode</h1>
        <p>Bei uns finden Sie eine exklusive Auswahl an Marken wie Adini, Seasalt und Zilch – perfekt für stilbewusste Damen, die Wert auf Qualität und Individualität legen. Lassen Sie sich inspirieren und entdecken Sie Mode, die begeistert!</p>
        <div class="marquee-container overflow-hidden">
          <div class="marquee-content d-flex align-items-center">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232526.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232532.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232547.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232561.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232567.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232597.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232693.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232707.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232736.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232785.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232911.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_232918.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233036.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233061.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233078.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233086.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233122.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233126.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233173.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233206.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233220.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233231.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233436.jpg" alt="">
            <img class="marquee-item" src="/src/img/2024 winter herbst/hd_2023_adini_lookbook_dec_233540.jpg" alt="">
          </div>
          <div class="marquee-container2">
            <div class="marquee-content2 align-items-center">
              <div class="marquee">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232526.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232532.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232547.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232561.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232567.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232597.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232693.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232707.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232736.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232785.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232911.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_232918.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233036.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233061.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233078.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233086.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233122.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233126.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233173.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233206.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233220.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233231.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233436.jpg" alt="">
                <img class="marquee-item2" src="/src/img/2024 winter herbst/th_2023_adini_lookbook_dec_233540.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
     <!-- cards -->

        <div class="cards text-center">
    <div class="row justify-content-center">
        <?php

        $sql = "SELECT id,titel, beschreibung, bild, link FROM marken";
        $result = $conn->query($sql);

        if ($result->num_rows > 0):
            while ($row = $result->fetch_assoc()):

                $bildPfad = "/src/admin/" . htmlspecialchars($row['bild']);
                $vollstaendigerPfad = $_SERVER['DOCUMENT_ROOT'] . $bildPfad;
        ?>
                <div class="col-lg-3 col-md-6 col-sm-6 mb-4">
                    <div class="card h-100">

                        <?php if (file_exists($vollstaendigerPfad) && !empty($row['bild'])): ?>
                            <img src="<?= $bildPfad ?>" class="card-img-top" alt="<?= htmlspecialchars($row['titel']) ?>">
                        <?php else: ?>

                            <img src="/src/admin/uploads/placeholder-image.jpg" class="card-img-top" alt="Bild nicht verfügbar">
                        <?php endif; ?>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title"><?= htmlspecialchars($row['titel']) ?></h5>
                            <p class="card-text flex-grow-1"><?= htmlspecialchars($row['beschreibung']) ?></p>
                           <a href="/src/sites/brands.php?id=<?= $row['id'] ?>" class="btn btn-primary mt-auto">Entdecken!</a>

                        </div>
                    </div>
                </div>
        <?php
            endwhile;
        else:
        ?>
            <p>Keine Marken gefunden.</p>
        <?php
        endif;
        ?>
    </div>
</div>
<!-- cards ende -->
 <!-- accordion -->
 <section>
  <div class="container">
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Unsere Marken
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            Entdecken Sie unsere exklusive Auswahl an renommierten Marken wie Adini, Seasalt und Zilch. Jede Marke steht für Qualität, Stil und Individualität, um Ihren persönlichen Look zu unterstreichen.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            Exklusiver Service
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            Unser engagiertes Team bietet Ihnen einen maßgeschneiderten Kundenservice, der auf Ihre individuellen Bedürfnisse eingeht. Von der persönlichen Beratung bis zur schnellen Lieferung – wir sorgen dafür, dass Ihr Einkaufserlebnis unvergesslich wird.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            Kontaktieren Sie Uns
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            Haben Sie Fragen oder benötigen Sie Unterstützung? Unser Kundenservice steht Ihnen jederzeit zur Verfügung. Kontaktieren Sie uns per E-Mail, Telefon oder über unser Kontaktformular, und wir helfen Ihnen gerne weiter.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- accordion ende -->
<!-- Scroll-to-Top Button -->
  <button id="scrollToTopBtn" aria-label="Scroll to top">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="white">
      <path d="M12 4l-7 7h4v7h6v-7h4l-7-7z"></path>
    </svg>
  </button>

  <script>
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
</script>
<!-- Scroll-to-Top Button Ende -->
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
 <!-- Cookie Consent Banner -->
<div id="cookieConsent" class="cookie-consent">
    <div class="cookie-container">
        <p>Diese Website verwendet Cookies, um sicherzustellen, dass Sie die beste Erfahrung auf unserer Website erhalten.</p>
        <button id="acceptAll" class="btn btn-primary">Alle akzeptieren</button>
        <button id="rejectAll" class="btn btn-secondary">Alle ablehnen</button>
        <button id="customizeCookies" class="btn btn-light">Anpassen</button>
    </div>
</div>

<!-- Cookie Settings Modal -->
<div id="cookieSettingsModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Cookie-Einstellungen</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="cookieSettingsForm">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="analyticsCookies">
            <label class="form-check-label" for="analyticsCookies">
              Google Analytics
            </label>
          </div>
          <!-- Add more cookie categories here if needed -->
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" id="saveSettings" class="btn btn-primary">Einstellungen speichern</button>
      </div>
    </div>
</div>

<!-- Google Analytics -->
<?php if(isset($_COOKIE['analytics_consent']) && $_COOKIE['analytics_consent'] === 'true'): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-XXXXXXX');
</script>
<?php endif; ?>

<script>
// Handle Cookie Consent
document.getElementById('acceptAll').addEventListener('click', function() {
    setCookie('analytics_consent', 'true', 365);
    hideCookieConsent();
    loadGoogleAnalytics();
});

document.getElementById('rejectAll').addEventListener('click', function() {
    setCookie('analytics_consent', 'false', 365);
    hideCookieConsent();
});

document.getElementById('customizeCookies').addEventListener('click', function() {
    var cookieSettingsModal = new bootstrap.Modal(document.getElementById('cookieSettingsModal'));
    cookieSettingsModal.show();
});

// Save Custom Settings
document.getElementById('saveSettings').addEventListener('click', function() {
    var analyticsConsent = document.getElementById('analyticsCookies').checked;
    setCookie('analytics_consent', analyticsConsent ? 'true' : 'false', 365);
    hideCookieConsent();
    if (analyticsConsent) {
        loadGoogleAnalytics();
    }
    var cookieSettingsModal = bootstrap.Modal.getInstance(document.getElementById('cookieSettingsModal'));
    cookieSettingsModal.hide();
});

// Helper Functions
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function hideCookieConsent() {
    document.getElementById('cookieConsent').style.display = 'none';
}
// Load Google Analytics
function loadGoogleAnalytics() {
    var script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
}

// Initialize Cookie Consent on Load
window.onload = function() {
    var consent = getCookie('analytics_consent');
    if (consent === null) {
        document.getElementById('cookieConsent').style.display = 'block';
    } else {
        if (consent === 'true') {
            loadGoogleAnalytics();
        }
        hideCookieConsent();
    }
};
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>