<?php
$servername = "localhost";
$username = "root"; // Hii ni default ya XAMPP
$password = "";     // Huwa haina password kama hujaweka
$dbname = "eforum_db"; // Jina uliloweka kule phpMyAdmin

// Fungua muunganisho (Connection)
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Angalia kama imekubali
if (!$conn) {
    die("Imefeli kuunganisha: " . mysqli_connect_error());
}
?>