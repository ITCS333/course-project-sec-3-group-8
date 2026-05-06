<?php
header('Content-Type: application/json');
include '../../config/db_connect.php'; 

$action = $_GET['action'] ?? '';

if ($action === 'list') {
    $result = $conn->query("SELECT id, email, is_admin FROM users");
    $users = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($users);
} 

elseif ($action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
?>
