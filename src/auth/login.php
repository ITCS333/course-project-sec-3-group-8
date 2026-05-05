<?php
session_start();
require_once("../common/db.php");


$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['is_admin'] = $user['is_admin'];

    echo json_encode([
        "status" => "success",
        "user" => $user
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email or password"
    ]);
}
?>
