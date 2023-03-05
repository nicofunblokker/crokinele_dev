function handleCheckboxClick(event) {
  const checkbox = event.target;
  const isChecked = checkbox.checked;
  const row = checkbox.parentNode.parentNode;
  const rowIndex = row.rowIndex - 1;
  const playerIndex = checkbox.parentNode.cellIndex - 1;
  const accuracyCell = document.getElementById(`player-${playerIndex + 1}-accuracy`);
  const previousAccuracy = Number(accuracyCell.textContent);
  const fraction = 1 / (row.parentNode.rows.length - 2);
  const newAccuracy = isChecked ? previousAccuracy + fraction : previousAccuracy - fraction;
  accuracyCell.textContent = newAccuracy.toFixed(2);
}

function updateHeader(event) {
  const headerCell = event.target;
  headerCell.contentEditable = true;
  headerCell.innerHTML = "";
  headerCell.focus();
  headerCell.addEventListener("blur", function() {
    if (!headerCell.textContent.trim()) {
      const playerIndex = headerCell.cellIndex - 1;
      headerCell.textContent = ["blue", "red", "white", "black"][playerIndex] || `Player ${headerCell.cellIndex}`;
    }
    headerCell.contentEditable = false;
  });
}

function updateHeaderName(event) {
  const headerInput = event.target;
  const headerText = headerInput.value.trim() || `Player ${headerInput.parentNode.cellIndex}`;
  headerInput.parentNode.innerHTML = headerText;
}

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
  const playerNames = ["blue", "red", "white", "black"];
  for (let i = 1; i <= numPlayers; i++) {
    const playerHeaderCell = headerRow.insertCell(i);
    playerHeaderCell.innerHTML = playerNames[i-1];
    playerHeaderCell.addEventListener("click", updateHeader);
    playerHeaderCell.addEventListener("click", updateHeaderName);
  }

  // Create new data rows
  for (let i = 1; i <= numRounds; i++) {
    const row = table.insertRow(i);
    const roundCell = row.insertCell(0);
    roundCell.innerHTML = i;
    for (let j = 1; j <= numPlayers; j++) {
      const scoreCell = row.insertCell(j);
      scoreCell.innerHTML = `<input type="checkbox" onclick="handleCheckboxClick(event)">`;
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