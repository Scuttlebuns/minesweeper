<?php
// File path: Minesweeper/php/db_connection.php

// Database connection details
$servername = "localhost"; // Default for XAMPP
$username = "root";        // Default XAMPP username
$password = "";            // Default XAMPP password (leave empty)
$dbname = "minesweeper";   // Name of your database

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>