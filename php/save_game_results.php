<?php
// File path: Minesweeper/php/save_game_results.php

session_start();
require 'db_connection.php'; // Ensure this path is correct

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not logged in"]);
    exit();
}

// Decode the JSON request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the data
if (!isset($data['win'], $data['duration'], $data['turns'])) {
    echo json_encode(["success" => false, "error" => "Invalid data"]);
    exit();
}

$player_id = $_SESSION['user_id'];
$win = $data['win'];
$duration = $data['duration'];
$turns = $data['turns'];

// Insert game result into the database
$stmt = $conn->prepare("INSERT INTO game_results (player_id, win, duration, turns) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiii", $player_id, $win, $duration, $turns);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>