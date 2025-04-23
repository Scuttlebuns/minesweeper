// File path: Minesweeper/js/loadComponents.js

function loadHTMLComponent(elementId, filePath) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error loading ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById(elementId).innerHTML = html;

      // If loading the header, check login status
      if (elementId === 'header') {
        setTimeout(checkLoginStatus, 0);
      }
    })
    .catch((error) => console.error(error));
}

// Function to check login status and update the header dynamically
function checkLoginStatus() {
  fetch('../php/check_login_status.php')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Login status data:', data);
      const loginSection = document.getElementById('login-section');
      if (!loginSection) {
        console.error('login-section element not found');
        return;
      }
      if (data.loggedIn) {
        // Dropdown will be shown on hover via CSS
        loginSection.innerHTML = `
          <div class="dropdown">
            <span>Logged in as: ${data.username}</span>
            <div class="dropdown-content">
              <a href="../php/logout_mysql.php">Logout</a>
            </div>
          </div>
        `;
      } else {
        console.log('User is not logged in.');
      }
    })
    .catch((error) => console.error('Error checking login status:', error));
}

// Load header and footer from the html/ folder
document.addEventListener('DOMContentLoaded', () => {
  loadHTMLComponent('header', '../html/header.html');
  loadHTMLComponent('footer', '../html/footer.html');
});