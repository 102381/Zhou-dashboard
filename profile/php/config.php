<?php
$host = "localhost";
$user = "admin-zhou";
$pass = "Minor-zhou";
$dbname = "zhou";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>