<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if ($data) {
    file_put_contents('data.json', json_encode($data));
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
}
?>
