var playerInputsDiv = document.getElementById("playerInputs");
//var addPlayerButton = document.getElementById("add-player-button");
//var calculateResultsButton = document.getElementById("calculate-results-button");
var calculateTotalButton = document.getElementById("calculate-total-button");
var resultsTable = document.getElementById("results");

var players = [];
var round = 0;

// Get the table element and its header row
const table = document.getElementById("hits");
const headerRow = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];



function updateGameIDLabel() {
  // Retrieve the csvData from local storage
  var csvData = JSON.parse(localStorage.getItem('csvData'));

  // Set the default value for highestGameID
  var highestGameID = 0;

  // Check if csvData exists
  if (csvData && csvData.length > 0) {
    // Find the highest gameID
    for (var i = 0; i < csvData.length; i++) {
      var gameID_v2 = parseInt(csvData[i][0]);
      if (gameID_v2 > highestGameID) {
        highestGameID = gameID_v2;
      }
    }
  }

  // Set the highest gameID as the label for the button
  document.getElementById('game-id').textContent = highestGameID.toString();
}

// Function to update the table based on the current player count
function updateTable(playerCount) {
  playerCount = sessionStorage.getItem("playerCount");
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


var startButton = document.getElementById("start");
startButton.style.display = 'none';
var playerDialog = document.getElementById("playerDialog");

var playerButtons = document.getElementsByClassName("player-button");

startButton.addEventListener("click", function () {
  playerDialog.style.display = "block";
});

window.addEventListener("load", function () {
  if (sessionStorage.getItem("playerInputsDiv") === null) {
    startButton.click();
  }
});

if (sessionStorage.getItem("playerInputsDiv") === null && sessionStorage.getItem("hits") !== null) {
  sessionStorage.removeItem("hits");
}

for (var i = 0; i < playerButtons.length; i++) {
  playerButtons[i].addEventListener("click", function () {
    var playerCount = this.value;
    sessionStorage.setItem("playerCount", playerCount);
    addPlayer(playerCount);
    playerDialog.style.display = "none";
    updateTable(playerCount)
  });
}


function addPlayer(playerCount) {
  var playerNames = [];

  for (var i = 0; i < playerCount; i++) {
    var playerName = prompt("Enter the name for Player " + (i + 1));
    if (playerName !== null && playerName.trim() !== "") {
      playerNames.push(playerName);
    }
  }

  // Assign default names only to empty names
  if (playerNames.length < playerCount) {
    var defaultNames = ["blue", "red", "white", "black"];
    for (var i = playerNames.length; i < playerCount; i++) {
      playerNames.push(defaultNames[i]);
    }
  }

  // Rest of the code remains the same...
  while (playerInputsDiv.firstChild) {
    playerInputsDiv.removeChild(playerInputsDiv.firstChild);
  }

  for (var i = 0; i < playerCount; i++) {
    var playerRow = document.createElement("div");
    playerRow.style.display = "flex";
    playerRow.style.alignItems = "center";
    playerRow.style.marginBottom = "10px";
  
    var playerNumber = document.createElement("div");
    playerNumber.style.width = "20px";
    playerNumber.style.height = "20px";
    playerNumber.style.borderRadius = "50%";
    playerNumber.style.marginRight = "10px";
    playerNumber.style.backgroundColor = getPlayerColor(i);
    playerRow.appendChild(playerNumber);
  
    var playerLabel = document.createElement("div");
    playerLabel.className = "player-name";
    playerLabel.textContent = playerNames[i] || "Player " + (i + 1);
    playerRow.appendChild(playerLabel);
  
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
  
  function getPlayerColor(index) {
    var colors = ["blue", "red", "white", "black"];
    return colors[index % colors.length];
  }
  sessionStorage.setItem("playerInputsDiv", playerInputsDiv.innerHTML);
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

    lastScoreInput.blur(); // Lose focus on the input field

    // After the cooldown duration, reset the cooldown flag
    setTimeout(function() {
      cooldownActive = false;
    }, cooldownDuration);
  }
});

function calculateResults() {
  var scores = [];
  var playerInputs = document.querySelectorAll(".player-input");
  var playerNames = [];

  // Reconstruct player names from DOM elements
  var playerLabels = document.querySelectorAll(".player-name");
  playerLabels.forEach(function(label) {
    playerNames.push(label.textContent);
  });

  // Remove existing "Total" rows from the table
  for (var i = resultsTable.rows.length - 1; i >= 0; i--) {
    var row = resultsTable.rows[i];
    if (row.cells[0].innerHTML === "Total") {
      resultsTable.deleteRow(i);
    }
  }

  // Iterate over playerInputs array
  for (var i = 0; i < playerInputs.length; i++) {
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

  // Add rows to the results table
  var maxScore = Math.max(...scores);
  for (var i = 0; i < playerInputs.length; i++) {
    var row = results.insertRow();
    var roundCell = row.insertCell(0);
    var playerCell = row.insertCell(1);
    var scoreCell = row.insertCell(2);
    roundCell.innerHTML = round;
    playerCell.innerHTML = playerNames[i];
    scoreCell.innerHTML = playerInputs[i].value;
    if (playerInputs[i].value == maxScore) {
      row.classList.add("winner");
    }
  }

  // Store updated results in sessionStorage
  sessionStorage.setItem("results", results.innerHTML);
}



playerCount.addEventListener("change", function () {
  addPlayer();
});

//calculateResultsButton.addEventListener("click", function () {
 // calculateResults();
//});

window.onload = function() {
  // Restore the saved results from sessionStorage
  var savedResults = sessionStorage.getItem("results");
  if (savedResults) {
    resultsTable.innerHTML = savedResults;
  }
  updateGameIDLabel();
  var storedPlayerInputsDiv = sessionStorage.getItem("playerInputsDiv");
  
  if (storedPlayerInputsDiv) {
    playerInputsDiv.innerHTML = storedPlayerInputsDiv;
  }

  // Retrieve the player count from sessionStorage on page load
var storedPlayerCount = sessionStorage.getItem("playerCount");
if (storedPlayerCount) {
  const playerCount = parseInt(storedPlayerCount);
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

  //sessionStorage.setItem("round", round);
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
    sessionStorage.clear();
    location.reload();
    //sessionStorage.setItem("round", 0);
}


let firstClick = null;
const columns = document.querySelectorAll('#hits th');

// Check if there is any data in the local storage for "hits" table
const storedData = sessionStorage.getItem('hits');
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
  let clickTimeout = null;
  let isCooldown = false;

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
      sessionStorage.setItem('hits', JSON.stringify(hitsData));
    }
  });

  column.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // prevent the default context menu from showing up
    if (column.textContent.length > 0) {
      column.textContent = column.textContent.slice(0, -1); // remove the last character
      // Update local storage with the new table data
      const hitsData = [];
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        hitsData.push(column.textContent);
      }
      sessionStorage.setItem('hits', JSON.stringify(hitsData));
    }
  });

  column.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1 && !isCooldown) {
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
        sessionStorage.setItem('hits', JSON.stringify(hitsData));

        // Set cooldown for the clicked column
        isCooldown = true;
        setTimeout(() => {
          isCooldown = false;
        }, 300);
      }
    }
    event.preventDefault(); // prevent the default touch event
  });

  column.addEventListener('touchend', () => {
    clearTimeout(clickTimeout);
    const hitsData = [];
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      hitsData.push(column.textContent);
    }
    sessionStorage.setItem('hits', JSON.stringify(hitsData));
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

const myDialog = document.getElementById("myDialog");
const option1Button = document.getElementById("option1");
const option2Button = document.getElementById("option2");
const option3Button = document.getElementById("option3");

resetButton.addEventListener("click", function () {
  myDialog.style.display = "block";
});

option1Button.onclick = () => {
  storeButton.click(); 
   reset();
  myDialog.style.display = "none";
};  

option2Button.onclick = () => {
  reset();
  myDialog.style.display = "none";
};

option3Button.onclick = () => {
  myDialog.style.display = "none";
};

document.addEventListener("mousedown", function (event) {
  const target = event.target;
  if (myDialog.style.display === "block" && !myDialog.contains(target)) {
    myDialog.style.display = "none";
  }
});

document.addEventListener("mousedown", function (event) {
  const target = event.target;
  if (playerDialog.style.display === "block" && !playerDialog.contains(target)) {
    playerDialog.style.display = "none";
  }
});

// Add button to download stored results as CSV
const downloadJsonButton = document.getElementById('download-json-button');

// Attach a click event listener to the download button
downloadJsonButton.addEventListener('click', function() {
  const myDialog2 = document.getElementById("myDialog2");
  const option4Button = document.getElementById("option4");
  const option5Button = document.getElementById("option5");
  const option6Button = document.getElementById("option6");

  myDialog2.style.display = "block"; // Display the dialogue box

  option4Button.onclick = () => {
    const action = '1';
    handleAction(action);
    myDialog2.style.display = "none"; // Hide the dialogue box
  };

  option5Button.onclick = () => {
    const action = '2';
    handleAction(action);
    myDialog2.style.display = "none"; // Hide the dialogue box
  };

  option6Button.onclick = () => {
    myDialog2.style.display = "none"; // Hide the dialogue box
  };
});

function handleAction(action) {
  if (action === '1') {
    // Retrieve data from localStorage
    const localStorageData = JSON.parse(localStorage.getItem('csvData'));

    // Check if there are no stored results
    if (!localStorageData || localStorageData.length === 0) {
      alert('No stored results available.'); // Display an error message
      return; // Exit the function
    }

    // Convert the data to CSV format
    const csvRows = [];
    for (let i = 0; i < localStorageData.length; i++) {
      const csvRow = localStorageData[i].join(',');
      csvRows.push(csvRow);
    }
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
  } else if (action === '2') {
    const resetConfirmation = confirm("Are you sure you want to reset localStorage? This action cannot be undone.");
    if (resetConfirmation) {
      // Reset localStorage
      localStorage.clear();
      updateGameIDLabel();
      alert('localStorage has been reset.');
    }
  } else {
    alert('Invalid action. Please choose either "download" or "reset".');
  }
}

document.addEventListener("mousedown", function (event) {
  const target = event.target;
  if (myDialog2.style.display === "block" && !myDialog2.contains(target)) {
    myDialog2.style.display = "none";
  }
});


// add button to store results locally
// Get a reference to the button element
const storeButton = document.getElementById('store-button');
storeButton.style.display = 'none';

// Attach a click event listener to the button
storeButton.addEventListener('click', function() {
  // Retrieve data from sessionStorage
  const hitsData = JSON.parse(sessionStorage.getItem('hits'));
  const resultsHtml = sessionStorage.getItem('results');

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

  // Add "hits" data to the corresponding rows
  if (hitsData && hitsData.length > 0) {
    const maxRows = Math.min(csvRows.length, hitsData.length); // Determine the maximum number of rows to consider
    for (let i = 0; i < maxRows; i++) {
      const hits = hitsData[i] || ''; // Check if hits data exists or set it as an empty string
      const hitsArray = Array.isArray(hits) ? hits : [hits]; // Convert hits to an array if it's not already
      for (let j = 0; j < hitsArray.length; j++) {
        const hitsValue = hitsArray[j];
        const csvRow = csvRows[i].split(','); // Get the corresponding CSV row
        csvRow.push(hitsValue);
        csvRows[i] = csvRow.join(',');
      }
    }
  }

  // Copy the data from sessionStorage to localStorage and add the "gameID" and "timestamp" columns
  let localStorageData = JSON.parse(localStorage.getItem('csvData'));
  if (!localStorageData) {
    localStorageData = []; // Initialize as an empty array if localStorageData is null
  }
  let gameID;
  if (localStorageData.length > 0) {
    gameID = parseInt(localStorageData[localStorageData.length - 1][0]) + 1; // Increment the previous gameID by 1
  } else {
    gameID = 1; // Set the initial gameID as 1
  }

  const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

  // Add "gameID", "timestamp", and hits to each row
  for (let i = 0; i < csvRows.length; i++) {
    const csvRow = csvRows[i].split(',');
    csvRow.unshift(timestamp); // Add the timestamp as the first column
    csvRow.unshift(gameID.toString()); // Add the gameID as the second column
    localStorageData.push(csvRow);
  }

  // Save the updated data to localStorage
  localStorage.setItem('csvData', JSON.stringify(localStorageData));

  // Display success message
  //alert('Results stored locally.');

  // Optional: Update any UI elements or perform additional actions

});
