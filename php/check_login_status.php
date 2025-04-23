<?php
// File path: Minesweeper/php/check_login_status.php
    
session_start();

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_SESSION['username'])) {
    echo json_encode([
        "loggedIn" => true,
        "username" => $_SESSION['username']
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>