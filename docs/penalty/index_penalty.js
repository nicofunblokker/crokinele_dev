function generateTable() {
  const table = document.getElementById("scoreTable");
  const numRounds = document.getElementById("numRounds").value;

  // Clear existing rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Create new rows
  for (let i = 1; i <= numRounds; i++) {
    const row = table.insertRow(-1);
    const roundCell = row.insertCell(0);
    roundCell.innerHTML = i;
    const scoreCell = row.insertCell(1);
    scoreCell.innerHTML = `<input type="checkbox" onclick="calculateFraction()">`;
  }

  // Calculate and display fraction
  calculateFraction();
}

function calculateFraction() {
  const table = document.getElementById("scoreTable");
  const numRounds = table.rows.length - 1; // Exclude header row
  let numCheckmarks = 0;

  for (let i = 1; i <= numRounds; i++) {
    const scoreCell = table.rows[i].cells[1];
    const checkbox = scoreCell.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      numCheckmarks++;
    }
  }

  const fraction = numCheckmarks / numRounds;

  const fractionText = document.getElementById("fraction");
  fractionText.innerHTML = `Accuracy: ${fraction.toFixed(2)}`;
}