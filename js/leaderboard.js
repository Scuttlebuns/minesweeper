// File path: Minesweeper/js/leaderboard.js

document.addEventListener("DOMContentLoaded", () => {
  const leaderboardTable = document.querySelector("#leaderboard-table tbody");
  const personalGamesTable = document.querySelector("#personal-games-table tbody");
  const sortDropdown = document.querySelector("#sort-dropdown");

  function fetchLeaderboard(sortBy = "total_wins", order = "DESC") {
    // Debug log to verify parameters
    console.log("Fetching leaderboard with:", sortBy, order);

    fetch(`../php/get_leaderboard.php?sort_by=${sortBy}&order=${order}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Fetched leaderboard data:", data); // Debug log
        leaderboardTable.innerHTML = "";
        personalGamesTable.innerHTML = "";

        // Populate leaderboard
        if (data.leaderboard.length === 0) {
          leaderboardTable.innerHTML = `<tr><td colspan="5">No data available</td></tr>`;
        } else {
          data.leaderboard.forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${player.username}</td>
              <td>${player.total_wins}</td>
              <td>${player.total_games}</td>
              <td>${player.total_time}</td>
            `;
            leaderboardTable.appendChild(row);
          });
        }

        // Populate personal games
        if (data.playerGames.length === 0) {
          personalGamesTable.innerHTML = `<tr><td colspan="3">You have not played any games yet.</td></tr>`;
        } else {
          data.playerGames.forEach(game => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${game.win ? "Win" : "Loss"}</td>
              <td>${game.duration}</td>
              <td>${game.turns}</td>
            `;
            personalGamesTable.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error("Error fetching leaderboard data:", error);
        leaderboardTable.innerHTML = `<tr><td colspan="5">Error loading data</td></tr>`;
        personalGamesTable.innerHTML = `<tr><td colspan="3">Error loading data</td></tr>`;
      });
  }

  // Handle sort dropdown change
  sortDropdown.addEventListener("change", (event) => {
    const [sortBy, order] = event.target.value.split("-");
    fetchLeaderboard(sortBy, order);
  });

  // Initial fetch
  fetchLeaderboard();
});