-- Erstellt eine neue Datenbank, z.B. "meinedatenbank"
CREATE DATABASE checkpot ;

-- Wählt die Datenbank aus, damit die Tabellen darin erstellt werden
USE checkpot;

CREATE TABLE marken (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    beschreibung VARCHAR(255) NOT NULL,
    bild VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

