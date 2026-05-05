<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../common/db.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && $password === $user['password']) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['is_admin'] = $user['is_admin'];
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
