<?php
include "../config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_FILES["profile_image"])) {

        $image = $_FILES["profile_image"]["tmp_name"];
        $type = $_FILES["profile_image"]["type"];

        $imgData = file_get_contents($image);
        $imgData = $conn->real_escape_string($imgData);

        $check = $conn->query("SELECT id FROM user_profile LIMIT 1");

        if ($check->num_rows > 0) {
            $sql = "UPDATE user_profile SET profile_image = '$imgData', image_mime_type = '$type' WHERE id = 1";
        } else {
            $sql = "INSERT INTO user_profile (profile_image, image_mime_type) VALUES ('$imgData', '$type')";
        }

        if ($conn->query($sql)) {
            echo "Image saved";
        } else {
            echo "Error: " . $conn->error;
        }
    }
}
?>