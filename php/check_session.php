<?php
// File path: Minesweeper/php/check_session.php

session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../html/login.html"); // Redirect to the login page
    exit();
}
?>