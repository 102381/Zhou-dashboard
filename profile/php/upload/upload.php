<?php
include "../config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["profile_image"])) {

    $image = $_FILES["profile_image"]["tmp_name"];
    $type = $_FILES["profile_image"]["type"];
    $size = $_FILES["profile_image"]["size"];

    // Only allow image files, and nothing bigger than 5MB
    $allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];

    if (!in_array($type, $allowedTypes)) {
        echo "Error: only PNG, JPEG, WEBP, and GIF images are allowed";
        exit;
    }

    if ($size > 5 * 1024 * 1024) {
        echo "Error: file is too large (max 5MB)";
        exit;
    }

    $imgData = file_get_contents($image);

    // Check if a profile already exists
    $check = $conn->query("SELECT id FROM user_profile WHERE id = 1");

    if ($check->num_rows > 0) {
        // Update existing image
        $stmt = $conn->prepare("UPDATE user_profile SET profile_image = ?, image_mime_type = ? WHERE id = 1");
        $stmt->bind_param("ss", $imgData, $type);
    } else {
        // Insert new image
        $stmt = $conn->prepare("INSERT INTO user_profile (profile_image, image_mime_type) VALUES (?, ?)");
        $stmt->bind_param("ss", $imgData, $type);
    }

    if ($stmt->execute()) {
        echo "Image saved";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>