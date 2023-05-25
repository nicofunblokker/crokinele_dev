var playerInputsDiv = document.getElementById("playerInputs");
//var addPlayerButton = document.getElementById("add-player-button");
//var calculateResultsButton = document.getElementById("calculate-results-button");
var calculateTotalButton = document.getElementById("calculate-total-button");
var resultsTable = document.getElementById("results");

var players = [];
var round = 0;


function addPlayer() {
  var playerCount = document.getElementById("playerCount").value;

  while (playerInputsDiv.childNodes.length > 0) {
    playerInputsDiv.removeChild(playerInputsDiv.childNodes[0]);
  }

  var playerNames = ["blue", "red", "white", "black"];
  for (var i = 0; i < playerCount; i++) {
    var playerRow = document.createElement("div");
    playerRow.style.display = "flex";
    playerRow.style.alignItems = "center";
    playerRow.style.marginBottom = "10px";

    var playerLabel = document.createElement("label");
    playerLabel.innerHTML = "P" + (i + 1);
    playerLabel.style.marginRight = "10px";
    playerRow.appendChild(playerLabel);

    var playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.classList.add("player-input");
    playerInput.style.marginRight = "10px";
    playerInput.value = playerNames[i] || "";
    playerInput.addEventListener("focus", (function(index) {
      return function() {
        if (this.value === playerNames[index]) {
          this.value = "";
        }
      };
    })(i));
    playerRow.appendChild(playerInput);

    var scoreLabel = document.createElement("label");
    scoreLabel.innerHTML = "Score";
    scoreLabel.style.marginRight = "10px";
    playerRow.appendChild(scoreLabel);

    var scoreInput = document.createElement("input");
    scoreInput.type = "number";
    scoreInput.classList.add("player-input");
    playerRow.appendChild(scoreInput);

    playerInputsDiv.appendChild(playerRow);
  }
  localStorage.setItem("playerInputsDiv", playerInputsDiv.innerHTML);
}

// Add event listener to the playerInputsDiv for keydown events on descendant input fields
var cooldownActive = false; // Flag to track cooldown state
var cooldownDuration = 1000; // Cooldown duration in milliseconds

playerInputsDiv.addEventListener("keydown", function(event) {
  var lastScoreInput = event.target;
  if (lastScoreInput.matches("input[type='number']") && event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission behavior

    if (cooldownActive) {
      // If cooldown is active, do nothing
      return;
    }

    cooldownActive = true; // Set cooldown flag
    calculateResults();

    // After the cooldown duration, reset the cooldown flag
    setTimeout(function() {
      cooldownActive = false;
    }, cooldownDuration);
  }
});


function calculateResults() {
  var scores = [];
  var playerInputs = document.querySelectorAll(".player-input");

  for (var i = 0; i < playerInputs.length; i += 2) {
    var playerNames = ["blue", "red", "white", "black"];
    if (playerInputs[i].value === "") {
      playerInputs[i].value = playerNames[i / 2 % playerNames.length];
    }
  }

  for (var i = resultsTable.rows.length - 1; i >= 0; i--) {
    var row = resultsTable.rows[i];
    if (row.cells[0].innerHTML === "Total") {
      resultsTable.deleteRow(i);
    }
  }

  for (var i = 1; i < playerInputs.length; i += 2) {
    if (playerInputs[i].value === "") {
      alert("Score cannot be empty. Please enter a valid score.");
      return;
    } else if (!isNaN(playerInputs[i].value) && playerInputs[i].value % 5 === 0) {
      // Calculate the round counter
      var round;
      var lastRow = resultsTable.rows[resultsTable.rows.length - 1];
      if (lastRow) {
        var roundCell = lastRow.cells[0];
        if (roundCell && !isNaN(parseInt(roundCell.innerHTML))) {
          round = parseInt(roundCell.innerHTML) + 1;
        } else {
          round = 1;
        }
      } else {
        round = 1;
      }

      // Rest of the code to calculate scores and add rows to the table...
      scores.push(playerInputs[i].value);
    } else {
      alert("Score has to be a numeric value and divisible by 5. Please enter a valid score.");
      return;
    }
  }






  
  var maxScore = Math.max(...scores);
  for (var i = 0; i < playerInputs.length; i += 2) {
    var row = results.insertRow();
    var roundCell = row.insertCell(0);
    var playerCell = row.insertCell(1);
    var scoreCell = row.insertCell(2);
    roundCell.innerHTML = round;
    playerCell.innerHTML = playerInputs[i].value;
    scoreCell.innerHTML = playerInputs[i + 1].value;
    if (playerInputs[i + 1].value == maxScore) {
      row.classList.add("winner");
    }
  }
  localStorage.setItem("results", results.innerHTML);
 //localStorage.setItem("round", round);
}


playerCount.addEventListener("change", function () {
  addPlayer();
});

//calculateResultsButton.addEventListener("click", function () {
 // calculateResults();
//});

window.onload = function() {
  // Restore the saved results from localStorage
  var savedResults = localStorage.getItem("results");
  if (savedResults) {
    resultsTable.innerHTML = savedResults;
  }

  var storedPlayerInputsDiv = localStorage.getItem("playerInputsDiv");
  
  if (storedPlayerInputsDiv) {
    playerInputsDiv.innerHTML = storedPlayerInputsDiv;
  }

  // Retrieve the player count from localStorage on page load
var storedPlayerCount = localStorage.getItem("playerCount");
if (storedPlayerCount) {
  const playerCount = parseInt(storedPlayerCount);
  playerCountInput.value = playerCount;
  updateTable(playerCount);
}
};
var deleteRoundButton = document.getElementById("delete-round-button");

function deleteRound() {
  let table = document.getElementById("results");
  let rows = table.rows;
  let lastRow = rows[rows.length - 1];
  let lastRowValue = lastRow.cells[0].innerHTML;
  let previousRowValue = "";

  for (let i = rows.length-1; i > 0; i--) {
    let row = rows[i];
    if (row.cells[0].innerHTML === lastRowValue) {
      previousRowValue = rows[i - 1].cells[0].innerHTML;
      table.deleteRow(i);
    }
  }

  let newRoundValue = parseInt(previousRowValue);
  if (!isNaN(newRoundValue)) {
    round = newRoundValue;
  } else if (round > 0) {
    round--;
  }

  //localStorage.setItem("round", round);
}


deleteRoundButton.addEventListener("click", function () {
  deleteRound();
});


function calculateTotal() {
  let table = document.getElementById("results");
  let rows = table.rows;
  let sums = {};
  let maxScore = 0;
  let maxScoreRows = [];
  let zeroScoreRows = [];

  for (var i = resultsTable.rows.length - 1; i >= 0; i--) {
    var row = resultsTable.rows[i];
    if (row.cells[0].innerHTML === "Total") {
      resultsTable.deleteRow(i);
    }
  }

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    let group = row.cells[1].innerHTML;
    let score = parseInt(row.cells[2].innerHTML);
    if (!sums[group]) {
      sums[group] = 0;
    }
    sums[group] += score;
  }

  let groups = Object.keys(sums);
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let sum = sums[group];
    let newRow = table.insertRow(rows.length);
    let groupCell = newRow.insertCell(0);
    groupCell.innerHTML = "Total";
    let nameCell = newRow.insertCell(1);
    nameCell.innerHTML = group;
    let sumCell = newRow.insertCell(2);
    sumCell.innerHTML = sum;

    if (sum > maxScore) {
      maxScore = sum;
      maxScoreRows = [newRow];
    } else if (sum === maxScore) {
      maxScoreRows.push(newRow);
    }

    if (sum === 0) {
      zeroScoreRows.push(newRow);
    }
  }

  maxScoreRows.forEach(row => {
    row.classList.add("max-score");
  });

  zeroScoreRows.forEach(row => {
    row.classList.add("zero-score");
  });
}

calculateTotalButton.addEventListener("click", function () {
  calculateTotal();
  //particlesJS();
});

function reset() {
    localStorage.clear();
    location.reload();
    playerCount.value = "0";
    //localStorage.setItem("round", 0);
}

// Get the table element and its header row
const table = document.getElementById("hits");
const headerRow = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];

// Function to update the table based on the current player count
function updateTable(playerCount) {

  localStorage.setItem("playerCount", playerCount);
  const columns = headerRow.children;
  
  // Hide or show the columns based on the current player count
  for (let i = 0; i < columns.length; i++) {
    if (i < playerCount) {
      columns[i].classList.remove("hidden");
    } else {
      columns[i].classList.add("hidden");
    }
  }
}



// Add an event listener to update the table when the playerCount changes
const playerCountInput = document.getElementById("playerCount"); // Assuming there's an input element with ID "playerCount"
playerCount.addEventListener("change", function () {
  const playerCount = parseInt(playerCountInput.value);
  updateTable(playerCount);
});



let firstClick = null;
const columns = document.querySelectorAll('#hits th');

// Check if there is any data in the local storage for "hits" table
const storedData = localStorage.getItem('hits');
if (storedData) {
  // If there is data in the local storage, update the table with it
  const hitsData = JSON.parse(storedData);
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (hitsData[i]) {
      column.textContent = hitsData[i];
    }
  }
}

columns.forEach((column, index) => {
  column.addEventListener('click', () => {
    if (!firstClick) {
      firstClick = column;
      firstClick.style.backgroundColor = 'yellow';
    } else {
      const secondClick = column;
      const secondClickBgColor = window.getComputedStyle(secondClick).getPropertyValue('background-color');
      const secondClickFirstLetter = secondClick.classList[0].charAt(0).toUpperCase();
      if (firstClick.textContent === '') {
        firstClick.textContent = secondClickFirstLetter;
      } else {
        firstClick.textContent += secondClickFirstLetter;
      }
      firstClick.style.backgroundColor = '';
      firstClick = null;
      
      // Update local storage with the new table data
      const hitsData = [];
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        hitsData.push(column.textContent);
      }
      localStorage.setItem('hits', JSON.stringify(hitsData));
    }
  });

  column.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // prevent the default context menu from showing up
    if (column.textContent.length > 0) {
      column.textContent = column.textContent.slice(0, -1); // remove the last character
         // Update local storage with the new table data
         hitsData = []; // Assign an empty array to reset the hitsData array
         for (let i = 0; i < columns.length; i++) {
           const column = columns[i];
           hitsData.push(column.textContent);
         }
         localStorage.setItem('hits', JSON.stringify(hitsData));
       }
  });

  column.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      // Single touch, add a letter
      if (!firstClick) {
        firstClick = column;
        firstClick.style.backgroundColor = 'yellow';
        clickTimeout = setTimeout(() => {
          // Long tap, remove last letter
          if (firstClick.textContent) {
            firstClick.textContent = firstClick.textContent.slice(0, -1);
          }
          firstClick.style.backgroundColor = '';
          firstClick = null;
        }, 600);
      } else {
        const secondClick = column;
        const secondClickBgColor = window.getComputedStyle(secondClick).getPropertyValue('background-color');
        const secondClickFirstLetter = secondClick.classList[0].charAt(0).toUpperCase();
        if (firstClick.textContent === '') {
          firstClick.textContent = secondClickFirstLetter;
        } else {
          firstClick.textContent += secondClickFirstLetter;
        }
        firstClick.style.backgroundColor = '';
        firstClick = null;
  
        // Update local storage with the new table data
        const hitsData = [];
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          hitsData.push(column.textContent);
        }
        localStorage.setItem('hits', JSON.stringify(hitsData));
      }
    }
    event.preventDefault(); // prevent the default touch event
  });
  
  column.addEventListener('touchend', () => {
    clearTimeout(clickTimeout);
    hitsData = []; // Assign an empty array to reset the hitsData array
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      hitsData.push(column.textContent);
    }
    localStorage.setItem('hits', JSON.stringify(hitsData));
  });
  
  column.addEventListener('touchmove', (event) => {
    event.preventDefault(); // prevent scrolling while dragging
  });

  column.addEventListener('touchcancel', (event) => {
    firstClick.style.backgroundColor = '';
    firstClick = null;
    event.preventDefault(); // prevent the default touch event
  });
});

var resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to reset?")) {
    reset();
  }
});



// Get a reference to the button element
const downloadJsonButton = document.getElementById('download-json-button');

// Attach a click event listener to the button
downloadJsonButton.addEventListener('click', function() {
  // Retrieve data from localStorage
  const hitsData = JSON.parse(localStorage.getItem('hits'));
  const resultsHtml = localStorage.getItem('results');

  // Check if there are no results available
  if (!resultsHtml) {
    alert('No table to export.'); // Display an error message
    return; // Exit the function
  }

  // Extract the table rows from the results HTML
  const resultsTable = document.createElement('table');
  resultsTable.innerHTML = resultsHtml;
  const rows = resultsTable.querySelectorAll('tr');

  // Create an array to store the CSV rows
  const csvRows = [];

  // Convert the "results" HTML table to CSV rows
  for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip the header row
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    const csvRow = Array.from(cells, cell => cell.textContent).join(',');
    csvRows.push(csvRow);
  }

  // Add "hits" data to the corresponding CSV rows
  if (hitsData && hitsData.length > 0) {
    let rowIndex = 0; // Track the current row index
    for (let i = 0; i < hitsData.length; i++) {
      const hits = hitsData[i] || ''; // Check if hits data exists or set it as an empty string
      const hitsArray = Array.isArray(hits) ? hits : [hits]; // Convert hits to an array if it's not already
      for (let j = 0; j < hitsArray.length; j++) {
        const hitsValue = hitsArray[j];
        const csvRow = csvRows[rowIndex] ? csvRows[rowIndex].split(',') : []; // Split the existing CSV row into an array
        csvRow.push(hitsValue);
        csvRows[rowIndex] = csvRow.join(',');
        rowIndex++; // Move to the next row index
      }
    }
  } else {
    // Add empty string to the CSV rows when hitsData is null or empty
    for (let i = 0; i < csvRows.length; i++) {
      csvRows[i] += ",";
    }
  }

  // Convert the array of CSV rows to a string
  const csvData = csvRows.join('\n');

  // Create a link element
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData));
  link.setAttribute('download', 'crokinele_results.csv');
  link.style.display = 'none';

  // Add the link to the DOM
  document.body.appendChild(link);

  // Simulate a click on the link to download the file
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
});