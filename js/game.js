// File path: Minesweeper/js/game.js

let debugMode = false;
let gridSize = 10; 
let numMines = 6; 
const grid = document.getElementById("minesweeper-grid");
let minefield = [];
let originalMinefield = null;
let flaggedCount = 0;
let timer = 0;
let timerInterval;
let timerStarted = false;
let gameOver = false;
let turns = 0;

// Audio setup
const backgroundAudio = new Audio('../audio/background.mp3');
const gameOverAudio = new Audio('../audio/game_over.mp3');
const winAudio = new Audio('../audio/game_win.mp3');

// 5 theme sets (no images, just colors)
const gridThemes = [
  {
    gridBackgroundColor: '#f0f0f0',
    revealedColor: '#e0e0e0',
    mineColor: '#990000',
    flagColor: '#750000',
    lineColor: '#ccc'
  },
  {
    gridBackgroundColor: '#e8f5e9',
    revealedColor: '#a5d6a7',
    mineColor: '#2e7d32',
    flagColor: '#1b5e20',
    lineColor: '#388e3c'
  },
  {
    gridBackgroundColor: '#e3f2fd',
    revealedColor: '#90caf9',
    mineColor: '#0d47a1',
    flagColor: '#1976d2',
    lineColor: '#42a5f5'
  },
  {
    gridBackgroundColor: '#fff8e1',
    revealedColor: '#ffe082',
    mineColor: '#f57f17',
    flagColor: '#f9a825',
    lineColor: '#fbc02d'
  },
  {
    gridBackgroundColor: '#fce4ec',
    revealedColor: '#f8bbd0',
    mineColor: '#880e4f',
    flagColor: '#ad1457',
    lineColor: '#c2185b'
  }
];
let currentThemeIndex = 0;

function initializeGame(newGrid = true) {
  resetTimer();
  flaggedCount = 0;
  turns = 0;
  timerStarted = false;
  gameOver = false;
  updateMineCounter();

  // Stop and reset any audio from previous games
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;

  if (newGrid) {
    minefield = generateMinefield();
    originalMinefield = JSON.parse(JSON.stringify(minefield));
  } else {
    minefield = JSON.parse(JSON.stringify(originalMinefield));
  }

  buildGridFromMinefield();

  if (debugMode) {
    revealAllMines();
  } else {
    hideMines();
  }
}

function generateMinefield() {
  const field = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill().map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0
    })));

  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);

    if (!field[row][col].mine) {
      field[row][col].mine = true;
      minesPlaced++;
    }
  }

  calculateAdjacentMinesForField(field);
  return field;
}

function buildGridFromMinefield() {
  grid.innerHTML = "";
  const tbody = document.createElement("tbody");
  for (let row = 0; row < gridSize; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const td = document.createElement("td");
      td.dataset.row = row;
      td.dataset.col = col;
      td.addEventListener("click", handleCellClick);
      td.addEventListener("contextmenu", handleCellRightClick);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  grid.appendChild(tbody);
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  timer = 0;
  document.getElementById("timer").textContent = `Time: ${timer}`;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `Time: ${timer}`;
  }, 1000);

  backgroundAudio.loop = true;
  backgroundAudio.currentTime = 0;
  backgroundAudio.play().catch(err => console.log("Audio play error:", err));
}

function resetTimer() {
  clearInterval(timerInterval);
  timer = 0;
  document.getElementById("timer").textContent = `Time: 0`;
}

function calculateAdjacentMinesForField(field) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (field[row][col].mine) continue;

      let count = 0;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          newRow >= 0 &&
          newRow < gridSize &&
          newCol >= 0 &&
          newCol < gridSize &&
          field[newRow][newCol].mine
        ) {
          count++;
        }
      }
      field[row][col].adjacentMines = count;
    }
  }
}

function handleCellClick(event) {
  if (gameOver) return;

  let cell = event.target;
  if (cell.tagName !== 'TD') {
    cell = cell.closest('td');
  }
  if (!cell) return;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  if (!timerStarted) startTimer();

  if (minefield[row][col].revealed || minefield[row][col].flagged) return;

  turns++;

  if (minefield[row][col].mine) {
    revealAllMines(); 
    clearInterval(timerInterval);
    gameOver = true;
    cell.classList.add("clicked-mine");
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    gameOverAudio.play().catch(err => console.log("Audio play error:", err));

    alert("Game Over! You clicked on a mine.");
    saveGameResult(false);
  } else {
    revealCell(row, col);
    checkWinCondition();
  }
}

function revealCell(row, col) {
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
  if (minefield[row][col].revealed || minefield[row][col].flagged) return;

  const tbody = grid.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");
  const cell = rows[row].getElementsByTagName("td")[col];

  minefield[row][col].revealed = true;
  cell.classList.add("revealed");

  if (minefield[row][col].adjacentMines > 0) {
    cell.textContent = minefield[row][col].adjacentMines;
  } else {
    revealCell(row - 1, col - 1);
    revealCell(row - 1, col);
    revealCell(row - 1, col + 1);
    revealCell(row, col - 1);
    revealCell(row, col + 1);
    revealCell(row + 1, col - 1);
    revealCell(row + 1, col);
    revealCell(row + 1, col + 1);
  }
}

function handleCellRightClick(event) {
  event.preventDefault();
  if (gameOver) return;

  let cell = event.target;
  if (cell.tagName !== 'TD') {
    cell = cell.closest('td');
  }
  if (!cell) return;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  if (minefield[row][col].revealed) return;
  if (!minefield[row][col].flagged && flaggedCount >= numMines) return;

  minefield[row][col].flagged = !minefield[row][col].flagged;
  cell.classList.toggle("flag");
  cell.textContent = minefield[row][col].flagged ? "🚩" : "";
  flaggedCount += minefield[row][col].flagged ? 1 : -1;
  updateMineCounter();

  turns++;
}

function updateMineCounter() {
  const minesLeft = numMines - flaggedCount;
  document.getElementById("mines-left").textContent = `Mines Left: ${Math.max(0, minesLeft)}`;
}

function checkWinCondition() {
  let unrevealedCount = 0;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!minefield[row][col].revealed && !minefield[row][col].mine) {
        unrevealedCount++;
      }
    }
  }
  if (unrevealedCount === 0) {
    clearInterval(timerInterval);
    gameOver = true; 
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    winAudio.play().catch(err => console.log("Audio play error:", err));

    alert("Congratulations! You win!");
    saveGameResult(true);
  }
}

function revealAllMines() {
  const tbody = grid.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");
  for (let row = 0; row < gridSize; row++) {
    const cells = rows[row].getElementsByTagName("td");
    for (let col = 0; col < gridSize; col++) {
      if (minefield[row][col].mine && !minefield[row][col].revealed) {
        const cell = cells[col];
        cell.classList.add("mine");
        cell.textContent = "💣";
      }
    }
  }
}

function hideMines() {
  if (!debugMode) {
    const tbody = grid.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");
    for (let row = 0; row < gridSize; row++) {
      const cells = rows[row].getElementsByTagName("td");
      for (let col = 0; col < gridSize; col++) {
        if (minefield[row][col].mine && !minefield[row][col].revealed) {
          const cell = cells[col];
          cell.classList.remove("mine");
          cell.textContent = "";
        }
      }
    }
  }
}

function saveGameResult(win) {
  const data = {
    win: win ? 1 : 0,
    duration: timer,
    turns: turns
  };

  fetch('../php/save_game_results.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log("Game result saved successfully.");
    } else {
      console.error("Error saving game result:", result.error);
    }
  })
  .catch(error => {
    console.error("Error saving game result:", error);
  });
}

function setDifficulty(newGridSize, newNumMines) {
  gridSize = newGridSize;
  numMines = newNumMines;
  initializeGame(true);
}

function toggleMines() {
  debugMode = !debugMode;
  const toggleButton = document.getElementById("toggle-mines-button");
  toggleButton.textContent = debugMode ? "Hide Mines" : "Show Mines";

  if (debugMode) {
    revealAllMines();
  } else {
    hideMines();
  }
}

// THEME CHANGING FUNCTIONS
function applyTheme(index) {
  const theme = gridThemes[index];
  const gameGridSection = document.querySelector('.game-grid');

  // Set CSS variables for colors and background
  gameGridSection.style.setProperty('--grid-background-color', theme.gridBackgroundColor);
  gameGridSection.style.setProperty('--revealed-color', theme.revealedColor);
  gameGridSection.style.setProperty('--mine-color', theme.mineColor);
  gameGridSection.style.setProperty('--flag-color', theme.flagColor);
  gameGridSection.style.setProperty('--line-color', theme.lineColor);
}

function changeGridTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % gridThemes.length;
  applyTheme(currentThemeIndex);
}

function resetGridTheme() {
  const gameGridSection = document.querySelector('.game-grid');
  // Remove inline styles for variables, reverting to defaults in CSS
  gameGridSection.style.removeProperty('--grid-background-color');
  gameGridSection.style.removeProperty('--revealed-color');
  gameGridSection.style.removeProperty('--mine-color');
  gameGridSection.style.removeProperty('--flag-color');
  gameGridSection.style.removeProperty('--line-color');
}

// Event listeners for difficulty buttons
document.getElementById("easy-button").addEventListener("click", function () {
  setDifficulty(10, 6);
});
document.getElementById("medium-button").addEventListener("click", function () {
  setDifficulty(10, 12);
});
document.getElementById("hard-button").addEventListener("click", function () {
  setDifficulty(10, 20);
});

// Event listeners for game controls
document.getElementById("new-game-button").addEventListener("click", function() {
  initializeGame(true);
});
document.getElementById("restart-game-button").addEventListener("click", function() {
  initializeGame(false);
});
document.getElementById("toggle-mines-button").addEventListener("click", toggleMines);

// Event listeners for theme change/reset
document.getElementById("change-grid-button").addEventListener("click", changeGridTheme);
document.getElementById("reset-grid-style-button").addEventListener("click", resetGridTheme);

// Start the game with default settings
initializeGame(true);