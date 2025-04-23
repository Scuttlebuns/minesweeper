<?php
// File path: Minesweeper/php/logout_mysql.php
session_start();

session_unset();
session_destroy();

header('Location: ../html/index.html');
exit();
?>