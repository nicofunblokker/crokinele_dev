// Retrieve the CSV data from localStorage
const csvData = localStorage.getItem("csvData");

const parsedData = csvData ? JSON.parse(csvData) : [];

//const parsedData = [["1","2023-06-01T16:39:51.897Z","1","a","5","B"],["1","2023-06-01T16:39:51.897Z","1","b","10","RB"],["1","2023-06-01T16:39:51.897Z","1","c","20","WS"],["1","2023-06-01T16:39:51.897Z","1","d","50","W"],["1","2023-06-01T16:39:51.897Z","2","a","5"],["1","2023-06-01T16:39:51.897Z","2","b","10"],["1","2023-06-01T16:39:51.897Z","2","c","20"],["1","2023-06-01T16:39:51.897Z","2","d","50"],["1","2023-06-01T16:39:51.897Z","3","a","5"],["1","2023-06-01T16:39:51.897Z","3","b","10"],["1","2023-06-01T16:39:51.897Z","3","c","25"],["1","2023-06-01T16:39:51.897Z","3","d","50"],["1","2023-06-01T16:39:51.897Z","4","a","50"],["1","2023-06-01T16:39:51.897Z","4","b","10"],["1","2023-06-01T16:39:51.897Z","4","c","25"],["1","2023-06-01T16:39:51.897Z","4","d","50"],["2","2023-06-01T16:40:29.161Z","1","blue","5","BRB"],["2","2023-06-01T16:40:29.161Z","1","red","0","BB"],["2","2023-06-01T16:40:29.161Z","1","white","60","W"],["2","2023-06-01T16:40:29.161Z","1","black","90","S"],["2","2023-06-01T16:40:29.161Z","2","blue","5"],["2","2023-06-01T16:40:29.161Z","2","red","60"],["2","2023-06-01T16:40:29.161Z","2","white","0"],["2","2023-06-01T16:40:29.161Z","2","black","5"],["2","2023-06-01T16:40:29.161Z","3","blue","50"],["2","2023-06-01T16:40:29.161Z","3","red","60"],["2","2023-06-01T16:40:29.161Z","3","white","0"],["2","2023-06-01T16:40:29.161Z","3","black","5"],["2","2023-06-01T16:40:29.161Z","4","blue","50"],["2","2023-06-01T16:40:29.161Z","4","red","35"],["2","2023-06-01T16:40:29.161Z","4","white","0"],["2","2023-06-01T16:40:29.161Z","4","black","50"]]


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