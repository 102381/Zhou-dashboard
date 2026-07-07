<?php
include "../config.php";

$sql = "SELECT profile_image, image_mime_type FROM user_profile WHERE id = 1";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

if ($row) {
    header("Content-Type: " . $row["image_mime_type"]);
    echo $row["profile_image"];
}
?>

