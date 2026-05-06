<?php
header('Content-Type: application/json');
require_once '../../config/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT id, email, is_admin FROM users WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "is_admin" => (bool)$user['is_admin']
            ]
        ]);
    } else {
        echo json_encode(["success" => false]);
    }
} else {
    echo json_encode(["success" => false]);
}
