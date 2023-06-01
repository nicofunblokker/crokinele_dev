// Retrieve the CSV data from localStorage
const csvData = localStorage.getItem("csvData");

// Parse the CSV data into an array of arrays
const parsedData = csvData ? JSON.parse(csvData) : [];

// Create an object to store the totals and counts for each player
const summary = {};

// Iterate over each row in the parsed data
for (const row of parsedData) {
  const player = row[3];
  const score = parseFloat(row[4]); // Corrected index to 5

  // Check if the player already exists in the summary object
  if (summary.hasOwnProperty(player)) {
    // If the player exists, update the total and count
    summary[player].total += score;
    summary[player].count += 1;
  } else {
    // If the player doesn't exist, initialize the total and count
    summary[player] = { total: score, count: 1 };
  }
}

// Create an array to store the summary table rows
const summaryTable = [];

// Iterate over the players in the summary object
for (const player in summary) {
  if (summary.hasOwnProperty(player)) {
    const total = summary[player].total;
    const count = summary[player].count;
    const mean = total / count;

    // Create a row array with player, total, and mean values
    const row = [player, total, mean];

    // Add the row to the summary table array
    summaryTable.push(row);
  }
}

// Sort the summary table by mean (descending order)
summaryTable.sort((a, b) => b[2] - a[2]);

// Generate HTML table
const table = document.createElement("table");

// Create table header
const headerRow = document.createElement("tr");
const headers = ["Player", "Total", "Mean"];
for (const header of headers) {
  const th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
table.appendChild(headerRow);

// Create table rows
if (summaryTable.length > 0) {
  for (const row of summaryTable) {
    const tableRow = document.createElement("tr");
    for (const cell of row) {
      const td = document.createElement("td");
      td.textContent = cell;
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
