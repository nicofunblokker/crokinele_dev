// Retrieve the CSV data from localStorage
const csvData = localStorage.getItem("csvData");

// Create an array to store the summary table rows
const summaryTable = [];

// Create table headers
const headers = ["Player", "Total", "Mean (per round)", "Games Won"];

if (csvData) {
    const parsedData = JSON.parse(csvData);
    const games = {};

    // Create an object to store the totals, counts, and games won for each player
    const summary = {};

    // Sum scores for each game ID for each player
    for (const row of parsedData) {
        const gameId = row[0];
        const player = row[3];
        const score = parseFloat(row[4]);

        if (!games[gameId]) {
            games[gameId] = {};
        }

        if (!games[gameId][player]) {
            games[gameId][player] = 0;
        }

        games[gameId][player] += score;
    }

    // Initialize totals, counts, and games won for all players
    for (const row of parsedData) {
        const player = row[3];
        if (!summary[player]) {
            summary[player] = { total: 0, count: 0, gamesWon: 0 };
        }
    }

    // Determine which player has won each game and count the number of games won
    for (const gameId in games) {
      let maxScore = -Infinity;
      let winners = [];
  
      for (const player in games[gameId]) {
          const playerScore = games[gameId][player];
  
          if (playerScore > maxScore) {
              maxScore = playerScore;
              winners = [player];
          } else if (playerScore === maxScore) {
              winners.push(player);
          }
      }
  
      if (winners.length > 0) {
          winners.forEach((winner) => {
              summary[winner].gamesWon += 1;
          });
      }
  }

    // Calculate totals and counts for all players
    for (const row of parsedData) {
        const player = row[3];
        const score = parseFloat(row[4]);
        summary[player].total += score;
        summary[player].count += 1;
    }

    // Calculate mean for all players
    for (const player in summary) {
        const total = summary[player].total;
        const count = summary[player].count;
        const mean = count === 0 ? 0 : total / count; // Calculate the mean
        const gamesWon = summary[player].gamesWon;
        const row = [player, total, mean, gamesWon];
        summaryTable.push(row);
    }

    // Sort the summary table by mean (descending order)
    summaryTable.sort((a, b) => b[2] - a[2]);
}

// Generate HTML table
const table = document.createElement("table");

// Create table header
const headerRow = document.createElement("tr");
for (const header of headers) {
  const th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
table.appendChild(headerRow);

// Check if summaryTable has rows or display only the headers
if (summaryTable.length > 0) {
  // Create table rows with rounded mean values
  for (const row of summaryTable) {
    const tableRow = document.createElement("tr");
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      const td = document.createElement("td");

      // Round the mean value to 2 decimal places
      if (i === 2) {
        td.textContent = parseFloat(cell).toFixed(2);
      } else {
        td.textContent = cell;
      }

      tableRow.appendChild(td);
    }
    table.appendChild(tableRow);
  }
} else {
  // If summaryTable is empty, create a row with colspan to display "No data available"
  const emptyRow = document.createElement("tr");
  const emptyCell = document.createElement("td");
  emptyCell.setAttribute("colspan", headers.length.toString());
  emptyCell.textContent = "No data available";
  emptyRow.appendChild(emptyCell);
  table.appendChild(emptyRow);
}

// Add the table to an existing HTML element
const tableContainer = document.getElementById("summary-table");
tableContainer.appendChild(table);
