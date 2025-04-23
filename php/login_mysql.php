<?php
// File path: Minesweeper/php/login_mysql.php

session_start();
require_once 'db_connection.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        die("Username and password cannot be empty.");
    }

    // Fetch user from database
    $stmt = $conn->prepare("SELECT id, password_hash FROM players WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($userId, $passwordHash);
    $stmt->fetch();

    if ($userId && password_verify($password, $passwordHash)) {
        // Successful login
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;

        // Uncomment for debugging
        // var_dump($_SESSION);

        header("Location: ../html/game.html"); // Redirect to game page
        exit();
    } else {
        echo "Invalid username or password.";
    }

    $stmt->close();
    $conn->close();
}
?>