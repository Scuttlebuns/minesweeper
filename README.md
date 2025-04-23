# Minesweeper Project - Readme  
**Created by Anthony**

---

## Prerequisites

- **XAMPP**: Ensure XAMPP is installed on your computer.  
- **Apache & MySQL**: Confirm that Apache and MySQL services are running through the XAMPP Control Panel.  
- **Supported Technologies**: This project uses HTML, CSS, JavaScript, and PHP. Ensure your environment can run these via XAMPP.  
- **Web Browser**: Use a modern browser (Chrome, Firefox, Edge, or Safari) to access the local pages.

---

## Installation Steps

1. **Download the Project**: Obtain the Minesweeper project ZIP file.

2. **Unzip the Project**: Extract the contents of the ZIP file.

3. **Place in `htdocs`**: Move the entire Minesweeper folder into the `htdocs` directory of your XAMPP installation.
   - **Windows**: `C:/Xampp/htdocs/minesweeper`
   - **Linux**: `/opt/lampp/htdocs/minesweeper`
   - **macOS**: `Applications/XAMPP/htdocs/minesweeper`

4. **Start XAMPP Services**:
   - Open the XAMPP Control Panel.
   - Click **Start** next to Apache and MySQL.

5. **Setup the Database**:
   - Open your browser and go to: `http://localhost/Minesweeper/php/setup_database.php`
   - This script will create the `minesweeper` database and required tables if they don’t exist.
   - If additional database settings are needed, navigate to `http://localhost/phpmyadmin/`

---

## Accessing the Project

Once the database is set up, navigate to the homepage:  
`http://localhost/Minesweeper/html/index.html`

---

## Using the Pages

- **Home (`index.html`)**: The main menu page, offering navigation to the game, leaderboard, help, contact, and login pages.  
- **Game (`game.html`)**: Play Minesweeper here. Click “New Game” for a fresh grid, “Restart” to reset the current grid, and “Show Mines” to toggle mine visibility. Use difficulty buttons for Easy, Medium, or Hard.  
- **Leaderboard (`leaderboard.html`)**: View top players and their stats. Sort by different criteria using the dropdown.  
- **Help (`help.html`)**: Instructions on how to play Minesweeper, controls, tips, and explanations of difficulty modes.  
- **Contact (`contact.html`)**: Information about the developer and how to reach them.  
- **Login (`login.html`)** and **Signup (`signup.html`)**: User authentication pages. If logged in, you can save game results and see your personal game history.

---

## Project Hierarchy
```text
Minesweeper/
├── Audio/
│   ├── background.mp3          # Background music for the game
│   ├── game_over.mp3           # Sound effect for losing the game
│   └── game_win.mp3            # Sound effect for winning the game
│
├── CSS/
│   ├── game.css                # Specific styling for the Minesweeper game page
│   ├── leaderboard.css         # Styling for the leaderboard page
│   └── style.css               # General shared styling for the project
│
├── HTML/
│   ├── contact.html            # Contact/About Me page
│   ├── footer.html             # Shared footer component
│   ├── game.html               # Minesweeper game page
│   ├── header.html             # Shared header component
│   ├── help.html               # Help page with game instructions
│   ├── index.html              # Main page with menu
│   ├── leaderboard.html        # Leaderboard page
│   ├── login.html              # Login page
│   └── signup.html             # Registration page
│
├── IMAGES/
│   ├── logo.png                # Logo used in the header
│   └── profile_picture.jpg     # Profile picture for the Contact page
│
├── JS/
│   ├── game.js                 # Minesweeper game logic and interactions
│   ├── loadComponents.js       # JavaScript for loading header and footer
│   └── leaderboard.js          # JavaScript for leaderboard functionality
│
├── PHP/
│   ├── check_login_status.php  # Validate user login status
│   ├── check_session.php       # Validate user sessions
│   ├── db_connection.php       # Database connection configuration
│   ├── get_leaderboard.php     # Retrieve leaderboard data
│   ├── login_mysql.php         # Handle user login
│   ├── logout_mysql.php        # Handle user logout
│   ├── register_mysql.php      # Handle user registration
│   ├── save_game_results.php   # Save game results to the database
│   └── setup_database.php      # Create database and tables if not existing
│
└── readme.md                   # Instructions for setting up and running the project
```
