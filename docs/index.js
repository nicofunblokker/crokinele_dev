var playerInputsDiv = document.getElementById("playerInputs");
var addPlayerButton = document.getElementById("add-player-button");
var calculateResultsButton = document.getElementById("calculate-results-button");
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

function calculateResults() {

  var results = document.getElementById("results");
  var scores = [];
  var playerInputs = document.querySelectorAll(".player-input");

  for (var i = 0; i < playerInputs.length; i += 2) {
    var playerNames = ["blue", "red", "white", "black"];
    if (playerInputs[i].value === "") {
      playerInputs[i].value = playerNames[i/2 % playerNames.length];
    }
  }
  for (var i = 1; i < playerInputs.length; i += 2) {
    if (playerInputs[i].value === "") {
      alert("Score cannot be empty. Please enter a valid score.");
      return;
    } else if (!isNaN(playerInputs[i].value) && playerInputs[i].value % 5 === 0) {
      round = localStorage.getItem("round") || 1;
      round++;
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
  localStorage.setItem("round", round);
}


addPlayerButton.addEventListener("click", function () {
  addPlayer();
});

calculateResultsButton.addEventListener("click", function () {
  calculateResults();
});

window.onload = function() {
  // Restore the saved results from localStorage
  var savedResults = localStorage.getItem("results");
  if (savedResults) {
    resultsTable.innerHTML = savedResults;
  }

  // Restore the saved round number from localStorage
  var savedRound = localStorage.getItem("round");
  if (savedRound) {
    round = parseInt(savedRound);
  }
  var storedPlayerInputsDiv = localStorage.getItem("playerInputsDiv");
  
  if (storedPlayerInputsDiv) {
    playerInputsDiv.innerHTML = storedPlayerInputsDiv;
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

  localStorage.setItem("round", round);
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
    localStorage.setItem("round", 0);
}

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
  reset();
});



// Get a reference to the button element
const downloadJsonButton = document.getElementById('download-json-button');

// Attach a click event listener to the button
downloadJsonButton.addEventListener('click', function() {
  // Retrieve data from localStorage
  const hitsData = JSON.parse(localStorage.getItem('hits'));
  const resultsHtml = localStorage.getItem('results');

  // Create an object that contains both the results HTML and the hits data
  const data = {
    results: resultsHtml,
    hits: hitsData
  };

  // Convert the object to a JSON string
  const jsonData = JSON.stringify(data);

  // Create a link element
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonData));
  link.setAttribute('download', 'crokinele_results.json');
  link.style.display = 'none';

  // Add the link to the DOM
  document.body.appendChild(link);

  // Simulate a click on the link to download the file
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
});

// particlesJS("particles-js", {
//     particles: {
//       number: {
//         value: 100,
//         density: {
//           enable: true,
//           value_area: 800
//         }
//       },
//       color: {
//         value: "#ffffff"
//       },
//       shape: {
//         type: "circle",
//         stroke: {
//           width: 0,
//           color: "#000000"
//         },
//         polygon: {
//           nb_sides: 5
//         },
//         image: {
//           src: "img/github.svg",
//           width: 100,
//           height: 100
//         }
//       },
//       opacity: {
//         value: 0.5,
//         random: false,
//         anim: {
//           enable: false,
//           speed: 1,
//           opacity_min: 0.1,
//           sync: false
//         }
//       },
//       size: {
//         value: 3,
//         random: true,
//         anim: {
//           enable: false,
//           speed: 40,
//           size_min: 0.1,
//           sync: false
//         }
//       },
//       line_linked: {
//         enable: true,
//         distance: 150,
//         color: "#ffffff",
//         opacity: 0.4,
//         width: 1
//       },
//       move: {
//         enable: true,
//         speed: 6,
//         direction: "none",
//         random: false,
//         straight: false,
//         out_mode: "out",
//         bounce: false,
//         attract: {
//           enable: false,
//           rotateX: 600,
//           rotateY: 1200
//         }
//       }
//     },
//     interactivity: {
//       detect_on: "canvas",
//       events: {
//         onhover: {
//           enable: true,
//           mode: "repulse"
//         },
//         onclick: {
//           enable: true,
//           mode: "push"
//         },
//         resize: true
//       },
//       modes: {
//         grab: {
//           distance: 400,
//           line_linked: {
//             opacity: 1
//           }
//         },
//         bubble: {
//           distance: 400,
//           size: 40,
//           duration: 2,
//           opacity: 8,
//           speed: 3
//         },
//         repulse: {
//           distance: 200,
//           duration: 0.4
//         },
//         push: {
//           particles_nb: 4
//         },
//         remove: {
//           particles_nb: 2
//         }
//       }
//     },
// });
