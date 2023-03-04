function generateTable() {
  const table = document.getElementById("scoreTable");
  const numRounds = document.getElementById("numRounds").value;
  const numPlayers = document.getElementById("numPlayers").value;

  // Clear existing rows and columns
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  // Create new header row
  const headerRow = table.insertRow(0);
  const roundHeaderCell = headerRow.insertCell(0);
  roundHeaderCell.innerHTML = "Round";
  for (let i = 1; i <= numPlayers; i++) {
    const playerHeaderCell = headerRow.insertCell(i);
    playerHeaderCell.innerHTML = "Player " + i;
  }

  // Create new data rows
  for (let i = 1; i <= numRounds; i++) {
    const row = table.insertRow(i);
    const roundCell = row.insertCell(0);
    roundCell.innerHTML = i;
    for (let j = 1; j <= numPlayers; j++) {
      const scoreCell = row.insertCell(j);
      scoreCell.innerHTML = `<input type="checkbox" onclick="calculateFraction()">`;
    }
  }

  // Add accuracy row
  const accuracyRow = table.insertRow(table.rows.length);
  const accuracyHeaderCell = accuracyRow.insertCell(0);
  accuracyHeaderCell.innerHTML = "Accuracy";
  for (let i = 1; i <= numPlayers; i++) {
    const accuracyCell = accuracyRow.insertCell(i);
    accuracyCell.id = `player-${i}-accuracy`;
    accuracyCell.innerHTML = "0.00";
  }

  // Calculate and display fraction
  calculateFraction();
}

function calculateFraction() {
  const table = document.getElementById("scoreTable");
  const numRounds = table.rows.length - 2; // Exclude header and accuracy rows
  const numPlayers = table.rows[0].cells.length - 2; // Exclude round and accuracy columns

  for (let j = 1; j < numPlayers + 2; j++) {
    let numCheckmarks = 0;
    for (let i = 1; i < numRounds + 1; i++) {
      const scoreCell = table.rows[i].cells[j];
      const checkbox = scoreCell.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        numCheckmarks++;
      }
    }
    const fraction = numCheckmarks / numRounds;
    const accuracyCell = table.rows[numRounds + 1].cells[j];
    accuracyCell.innerHTML = `${(fraction * 100).toFixed(2)}%`;
  }
}