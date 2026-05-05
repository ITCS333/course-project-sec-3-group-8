<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../common/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $pdo = getDBConnection();

    // 1. Authentication (Login)
    if ($method === 'POST' && $action === 'login') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data['password'], $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['is_admin'] = (int)$user['is_admin'];
            echo json_encode(['success' => true, 'is_admin' => $_SESSION['is_admin']]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        exit;
    }

    // Protection: Only Admin can access the following methods
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== 1) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access Denied']);
        exit;
    }

    // 2. Get All Users (Read)
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT id, name, email, is_admin FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $users]);
    } 
    // 3. Add User (Create)
    else if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $hashedPassword, $data['is_admin']]);
        http_response_code(201);
        echo json_encode(['success' => true]);
    } 
    // 4. Delete User (Delete)
    else if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
