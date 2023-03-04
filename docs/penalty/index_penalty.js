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

function downloadTable() {
  const table = document.getElementById("scoreTable");
  const data = [];
  const headers = [];
  for (let i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerText.toLowerCase();
  }
  for (let i = 1; i < table.rows.length; i++) {
    const rowData = {};
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      const cell = table.rows[i].cells[j];
      const checkbox = cell.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        rowData[headers[j]] = 1;
      } else {
        rowData[headers[j]] = cell.innerText || 0;
      }
    }
    data.push(rowData);
  }
  const jsonData = JSON.stringify(data);
  const a = document.createElement("a");
  const file = new Blob([jsonData], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = "scoreTable.json";
  a.click();
}

var numRoundsInput = document.getElementById("numRounds");

numRoundsInput.addEventListener("blur", function() {
  const numRounds = parseInt(numRoundsInput.value);
  if (isNaN(numRounds)) {
    numRoundsInput.value = numRoundsInput.defaultValue;
  } else if (numRounds > numRoundsInput.max) {
    numRoundsInput.value = numRoundsInput.max;
  } else if (numRounds < numRoundsInput.min) {
    numRoundsInput.value = numRoundsInput.min;
  }
});