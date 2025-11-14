<?php
// Datenbankverbindung herstellen
include("connect.php");

// Löschaktion verarbeiten
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['delete_ids'])) {
        $delete_ids = $_POST['delete_ids'];
        foreach ($delete_ids as $id) {
            $sql = "DELETE FROM marken WHERE id=$id";
            $conn->query($sql);
        }
    }
}

// Daten aus der Tabelle abrufen
$sql = "SELECT id, titel, beschreibung, bild FROM marken";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Delete Form</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/styles/delete.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/index.php">Checkpot Control-Panel</a>
            <a class="link" href="index.php">Zurück</a>
        </div>
    </nav>
    <!-- Navbar Ende -->

    <div class="sidebar">
        <form method="post" action="edit_form.php">
            <input type="hidden" name="edit_ids" id="edit_ids">
            <input type="submit" class="btn btn-primary" value="Edit Selected">
        </form>
        <form method="post" action="">
            <input type="submit" class="btn btn-danger mt-2" value="Delete Selected">
        </form>
    </div>

    <div class="content">
        <div class="container mt-5">
            <h2 class="mb-4">Delete Form</h2>
            <form method="post" action="">
                <table class="table table-bordered table-striped">
                    <thead class="thead-dark">
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                            <th>Bild</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        if ($result->num_rows > 0) {
                            // Daten in der Tabelle anzeigen
                            while($row = $result->fetch_assoc()) {
                                echo "<tr>";
                                echo "<td><input type='checkbox' class='custom-checkbox' name='delete_ids[]' value='" . $row["id"] . "'></td>";
                                echo "<td>" . $row["id"] . "</td>";
                                echo "<td>" . $row["titel"] . "</td>";
                                echo "<td>" . $row["beschreibung"] . "</td>";
                                echo "<td><img src='" . $row["bild"] . "' alt='Bild' style='width: 100px; height: auto;'></td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='5'>Keine Daten gefunden</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </form>
        </div>
    </div>

    <script>
        document.querySelector('form[action="edit_form.php"]').addEventListener('submit', function(event) {
            var selectedIds = [];
            document.querySelectorAll('input[name="delete_ids[]"]:checked').forEach(function(checkbox) {
                selectedIds.push(checkbox.value);
            });
            document.getElementById('edit_ids').value = selectedIds.join(',');
        });
    </script>
</body>
</html>

<?php
$conn->close();
?>