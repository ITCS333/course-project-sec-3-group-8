<?php
session_start();
include '../../db.php';

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "Email and password required"
        ]);
        exit;
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if ($password === $user['password']) {

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['is_admin'] = $user['is_admin'];

            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "is_admin" => $user['is_admin']
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Wrong password"
            ]);
        }

    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
}
?>
