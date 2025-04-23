<?php
// File path: Minesweeper/php/get_leaderboard.php
require_once 'db_connection.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Fetch sorting criteria from GET parameters
$sortBy = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'total_wins';
$order = isset($_GET['order']) ? strtoupper($_GET['order']) : 'DESC';

// Allowed sorting fields and orders
$allowedSortFields = ['total_wins', 'total_time', 'total_games'];
$allowedOrder = ['ASC', 'DESC'];

if (!in_array($sortBy, $allowedSortFields)) {
    $sortBy = 'total_wins';
}
if (!in_array($order, $allowedOrder)) {
    $order = 'DESC';
}

// Fetch the leaderboard
$query = "SELECT 
            username, 
            SUM(win) AS total_wins, 
            COUNT(*) AS total_games, 
            SUM(duration) AS total_time, 
            AVG(turns) AS avg_turns 
          FROM game_results 
          JOIN players ON game_results.player_id = players.id 
          GROUP BY username 
          ORDER BY $sortBy $order 
          LIMIT 10";

$result = $conn->query($query);
$leaderboard = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}

// Fetch all games played by the logged-in user
session_start();
$playerGames = [];

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $playerQuery = "SELECT 
                      win, 
                      duration, 
                      turns 
                    FROM game_results 
                    WHERE player_id = ? 
                    ORDER BY created_at DESC";

    $stmt = $conn->prepare($playerQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $playerResult = $stmt->get_result();

    while ($playerResult && $row = $playerResult->fetch_assoc()) {
        $playerGames[] = $row;
    }
}

echo json_encode([
    'leaderboard' => $leaderboard,
    'playerGames' => $playerGames
]);

$conn->close();